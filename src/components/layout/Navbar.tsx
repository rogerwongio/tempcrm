import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Lead Manager
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/")
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                Dashboard
              </Link>
              <Link
                to="/leads"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/leads")
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                Leads
              </Link>
              <Link
                to="/proposals"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive("/proposals")
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                Hot Leads
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
