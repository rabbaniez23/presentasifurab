#!/bin/bash

# ==========================================
# FURAB AZURE AKS DEPLOYMENT SCRIPT
# ==========================================
# Script ini digunakan untuk deploy Furab Backend ke Azure AKS
# HANYA SAAT PRESENTASI untuk menghemat budget $50!

echo "🚀 Memulai Deployment Furab Backend ke Azure AKS..."

# 1. Login ke Azure (pastikan az cli sudah terinstall)
# az login

# 2. Set variabel resource group dan cluster
RESOURCE_GROUP="FurabResourceGroup"
CLUSTER_NAME="FurabAKSCluster"

echo "⚙️ Menghubungkan ke AKS Cluster: $CLUSTER_NAME"
# az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing

echo "📦 Mengaplikasikan konfigurasi Kubernetes (Helm/Manifests)..."
# Menggunakan Helm chart yang ada di repo backend
# helm upgrade --install furab-release ./furab-backend/helm-charts

echo "✅ Deployment selesai! Backend Furab kini berjalan di Azure."
echo "⚠️ JANGAN LUPA: Matikan (Stop/Delete) cluster setelah presentasi selesai agar budget $50 tidak habis!"
