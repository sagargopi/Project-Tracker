"use client";

import { useAuth } from "@/components/auth-provider";
import LoginForm from "@/components/login-form";
import AdminDashboard from "@/components/admin-dashboard";
import MemberDashboard from "@/components/member-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="w-full max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {currentUser.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <MemberDashboard />
      )}
    </div>
  );
}
