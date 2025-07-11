import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "@/pages/Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOwner?: boolean;
}

export function ProtectedRoute({
  children,
  requireOwner = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isOwner } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users away from login page
    if (isAuthenticated && location.pathname === "/login") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (requireOwner && !isOwner) {
    return (
      <div className="min-h-screen bg-dashboard-gray flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              strokeCurrentColor
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.122 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Accès Restreint
          </h2>
          <p className="text-gray-600">
            Seul le Supa Admin peut accéder à cette section.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cette action nécessite des privilèges administrateur.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
