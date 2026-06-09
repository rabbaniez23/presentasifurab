import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Compass, Layers, Navigation, Plus, Minus } from 'lucide-react-native';
import { furapColors } from '../theme/theme';

interface MockGoogleMapProps {
  children?: React.ReactNode;
  pickupCoords?: [number, number];
  destinationCoords?: [number, number];
  driverCoords?: [number, number];
  driverState?: string;
  progress?: number; // 0 to 100
  mode?: 'pin' | 'search' | 'track_ride' | 'track_food';
  merchantName?: string;
}

export default function MockGoogleMap({
  children,
  pickupCoords = [-6.859663, 107.599767], // Default UPI
  destinationCoords = [-6.894380, 107.604620], // Default Ciwalk
  driverState = 'coming',
  progress = 0,
  mode = 'pin',
  merchantName = 'Restoran'
}: MockGoogleMapProps) {
  const webViewRef = useRef<WebView>(null);

  // Send message to WebView to perform actions (Zoom, locate, update path)
  const sendToWebView = (action: string, data?: any) => {
    webViewRef.current?.postMessage(JSON.stringify({ action, data }));
  };

  useEffect(() => {
    // Send state update to WebView whenever progress or state changes
    sendToWebView('updateState', {
      driverState,
      progress,
      pickupCoords,
      destinationCoords,
      mode,
      merchantName
    });
  }, [driverState, progress, mode, pickupCoords, destinationCoords]);

  // Leaflet Map HTML code using CartoDB Voyager styles
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #F4F3F0;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        .leaflet-control-zoom {
          display: none !important;
        }

        /* Styling Markers */
        .pin-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .gps-blue-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #1A73E8;
          border: 3px solid #FFFFFF;
          box-shadow: 0 0 6px rgba(0,0,0,0.3);
        }

        .gps-blue-dot-pulse {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(26, 115, 232, 0.2);
          animation: pulse-blue 1.8s infinite ease-out;
          z-index: -1;
        }

        @keyframes pulse-blue {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .custom-pin {
          width: 32px;
          height: 32px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .car-icon {
          width: 32px;
          height: 32px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310B981" width="32" height="32"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5" fill="white"/><circle cx="16.5" cy="14.5" r="1.5" fill="white"/></svg>');
        }

        .pin-label {
          background-color: #FFFFFF;
          color: #1A1A1A;
          font-family: sans-serif;
          font-size: 11px;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          white-space: nowrap;
          margin-top: 4px;
          border: 1px solid #E5E7EB;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          maxZoom: 18,
          minZoom: 10
        }).setView([-6.859663, 107.599767], 15);

        // CartoDB Voyager tiles (Looks exactly like Google Maps)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(map);

        // Markers holders
        var pickupMarker = null;
        var destinationMarker = null;
        var driverMarker = null;
        var clientMarker = null;
        var routeLine = null;
        var radarCircle = null;

        // Custom divIcon helper
        function createDivIcon(htmlContent) {
          return L.divIcon({
            html: htmlContent,
            className: '',
            iconSize: [40, 60],
            iconAnchor: [20, 30]
          });
        }

        // Interpolation helper (LERP)
        function interpolate(p1, p2, t) {
          return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
        }

        // Handle states
        function updateMap(data) {
          var mode = data.mode;
          var pCoords = data.pickupCoords;
          var dCoords = data.destinationCoords;
          var driverState = data.driverState;
          var progress = data.progress / 100;

          // Clear previous map objects
          if (pickupMarker) map.removeLayer(pickupMarker);
          if (destinationMarker) map.removeLayer(destinationMarker);
          if (driverMarker) map.removeLayer(driverMarker);
          if (clientMarker) map.removeLayer(clientMarker);
          if (routeLine) map.removeLayer(routeLine);
          if (radarCircle) map.removeLayer(radarCircle);

          if (mode === 'pin') {
            // Static Center Pin simulation - map is centered at pickup
            map.setView(pCoords, 16);
          } 
          
          else if (mode === 'search') {
            // Pulse at center
            map.setView(pCoords, 15);
            clientMarker = L.marker(pCoords, {
              icon: createDivIcon('<div class="pin-container"><div class="gps-blue-dot-pulse"></div><div class="gps-blue-dot"></div></div>')
            }).addTo(map);

            // Radar Scan circle
            radarCircle = L.circle(pCoords, {
              radius: 500,
              color: '#1A73E8',
              fillColor: '#1A73E8',
              fillOpacity: 0.1,
              weight: 1.5
            }).addTo(map);
          } 
          
          else if (mode === 'track_ride') {
            // Ride Tracking Mode
            pickupMarker = L.marker(pCoords, {
              icon: createDivIcon('<div class="pin-container"><div class="custom-pin" style="background-image: url(\\'data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%2310B981\\' width=\\'32\\' height=\\'32\\'><path d=\\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\\'/></svg>\\');"></div><div class="pin-label">Kamu</div></div>')
            }).addTo(map);

            destinationMarker = L.marker(dCoords, {
              icon: createDivIcon('<div class="pin-container"><div class="custom-pin" style="background-image: url(\\'data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23EF4444\\' width=\\'32\\' height=\\'32\\'><path d=\\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\\'/></svg>\\');"></div><div class="pin-label">Tujuan</div></div>')
            }).addTo(map);

            // Draw route polyline
            routeLine = L.polyline([pCoords, dCoords], {
              color: '#3B82F6',
              weight: 4,
              opacity: 0.8,
              dashArray: '5, 8'
            }).addTo(map);

            // Driver Marker interpolation
            var driverPos;
            if (driverState === 'coming') {
              var startPos = [-6.878, 107.602]; // Start from Dago area
              driverPos = interpolate(startPos, pCoords, progress);
              map.setView(driverPos, 14);
            } else if (driverState === 'arrived') {
              driverPos = pCoords;
              map.setView(driverPos, 16);
            } else {
              // 'trip' state
              driverPos = interpolate(pCoords, dCoords, progress);
              map.setView(driverPos, 14);
            }

            driverMarker = L.marker(driverPos, {
              icon: createDivIcon('<div class="pin-container"><div class="custom-pin car-icon"></div><div class="pin-label">Driver</div></div>')
            }).addTo(map);
          } 
          
          else if (mode === 'track_food') {
            // Food Tracking Mode (Home = pCoords, Merchant = dCoords)
            pickupMarker = L.marker(pCoords, {
              icon: createDivIcon('<div class="pin-container"><div class="custom-pin" style="background-image: url(\\'data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%233B82F6\\' width=\\'32\\' height=\\'32\\'><path d=\\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\\'/></svg>\\');"></div><div class="pin-label">Rumah Kamu</div></div>')
            }).addTo(map);

            destinationMarker = L.marker(dCoords, {
              icon: createDivIcon('<div class="pin-container"><div class="custom-pin" style="background-image: url(\\'data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%2310B981\\' width=\\'32\\' height=\\'32\\'><path d=\\'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\\'/></svg>\\');"></div><div class="pin-label">' + data.merchantName + '</div></div>')
            }).addTo(map);

            routeLine = L.polyline([dCoords, pCoords], {
              color: '#F59E0B',
              weight: 4,
              opacity: 0.8
            }).addTo(map);

            var driverPos;
            if (driverState === 'ordering') {
              driverPos = dCoords; // Restoran
              map.setView(driverPos, 16);
            } else if (driverState === 'delivering') {
              driverPos = interpolate(dCoords, pCoords, progress);
              map.setView(driverPos, 14);
            } else {
              // 'arrived'
              driverPos = pCoords;
              map.setView(driverPos, 16);
            }

            driverMarker = L.marker(driverPos, {
              icon: createDivIcon('<div class="pin-container"><div class="custom-pin car-icon"></div><div class="pin-label">Driver</div></div>')
            }).addTo(map);
          }
        }

        // Listen for message from React Native
        window.addEventListener('message', function(event) {
          try {
            var msg = JSON.parse(event.data);
            if (msg.action === 'zoomIn') {
              map.zoomIn();
            } else if (msg.action === 'zoomOut') {
              map.zoomOut();
            } else if (msg.action === 'locate') {
              map.setView([-6.859663, 107.599767], 16);
            } else if (msg.action === 'updateState') {
              updateMap(msg.data);
            }
          } catch(e) {
            console.error("WebView error:", e);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.mapContainer}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={StyleSheet.absoluteFillObject}
        scrollEnabled={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        onLoadEnd={() => {
          // Send initial state
          sendToWebView('updateState', {
            driverState,
            progress,
            pickupCoords,
            destinationCoords,
            mode,
            merchantName
          });
        }}
      />

      {/* Floating Buttons UI (Google Maps Style overlays) */}
      <View style={styles.controlsContainer}>
        {/* Compass */}
        <TouchableOpacity style={styles.mapActionBtn} onPress={() => sendToWebView('locate')}>
          <Compass color="#5F6368" size={20} />
        </TouchableOpacity>

        {/* Zoom Controls */}
        <View style={styles.zoomButtonGroup}>
          <TouchableOpacity style={styles.zoomBtn} onPress={() => sendToWebView('zoomIn')}>
            <Plus color="#5F6368" size={18} />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={styles.zoomBtn} onPress={() => sendToWebView('zoomOut')}>
            <Minus color="#5F6368" size={18} />
          </TouchableOpacity>
        </View>

        {/* GPS Locate Button */}
        <TouchableOpacity style={styles.gpsLocateBtn} onPress={() => sendToWebView('locate')}>
          <Navigation color="#1A73E8" size={22} fill="#1A73E8" />
        </TouchableOpacity>
      </View>

      {/* Render children overlays if any (e.g. search bars, etc.) */}
      {children && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  controlsContainer: {
    position: 'absolute',
    right: 16,
    top: 110,
    alignItems: 'center',
    zIndex: 20,
  },
  mapActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomButtonGroup: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  zoomBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#E8EAED',
    marginHorizontal: 8,
  },
  gpsLocateBtn: {
    marginTop: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
