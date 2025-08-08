"use client";

import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import "./globals.css";

// Client component that uses hooks
function ClientLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {currentUser && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Project Tracker</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as: {currentUser.username} ({currentUser.role})
              </span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

// Server component (default export)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
