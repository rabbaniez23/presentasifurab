import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, Users, CreditCard, Settings } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Furab Analytics",
  description: "Web Analytics Dashboard for Furab Super-App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--color-background)] text-[var(--color-text)] flex h-screen overflow-hidden`}>
        
        {/* Sidebar Navigation */}
        <aside className="w-64 neo-border bg-[var(--color-primary)] flex flex-col justify-between m-4 rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div>
            <div className="p-6 border-b-4 border-black bg-[var(--color-accent)]">
              <h1 className="text-3xl font-black tracking-tighter">FURAB.</h1>
              <p className="font-bold text-sm">Analytics</p>
            </div>
            
            <nav className="p-4 space-y-2">
              <a href="#" className="flex items-center space-x-3 p-3 bg-white neo-border rounded-lg neo-shadow-hover">
                <LayoutDashboard size={20} />
                <span className="font-bold">Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 hover:bg-white/50 rounded-lg transition-colors border-2 border-transparent hover:border-black font-semibold">
                <Users size={20} />
                <span>Users</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 hover:bg-white/50 rounded-lg transition-colors border-2 border-transparent hover:border-black font-semibold">
                <CreditCard size={20} />
                <span>Transactions</span>
              </a>
            </nav>
          </div>
          
          <div className="p-4 border-t-4 border-black bg-white">
            <a href="#" className="flex items-center space-x-3 p-2 font-bold">
              <Settings size={20} />
              <span>Settings</span>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pl-0">
          <div className="bg-white w-full h-full neo-border rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 overflow-y-auto">
            {children}
          </div>
        </main>
        
      </body>
    </html>
  );
}
