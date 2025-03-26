import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Trophy,
  Calendar,
  UserCircle,
  Dumbbell,
  Medal,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const userType = useSelector((state) => state.auth.user_type);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-indigo-950 text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Trophy className="h-8 w-8 text-indigo-300" />
            <span className="ml-2 text-xl font-bold">College Sports Hub</span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-indigo-800"
                }`}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/events")
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-indigo-800"
                }`}
              >
                Events
              </Link>
              <Link
                to="/equipment-list"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/equipment")
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-indigo-800"
                }`}
              >
                Equipment
              </Link>
              <Link
                to="/user/feedback"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/achievements")
                    ? "bg-indigo-800 text-white"
                    : "hover:bg-indigo-800"
                }`}
              >
                Achievements
              </Link>
              {userType !== null && (
                <Link
                  to={userType === "admin" ? "/admin" : "/profile-page"}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(userType === "admin" ? "/admin" : "/profile-page")
                      ? "bg-indigo-800 text-white"
                      : "hover:bg-indigo-800"
                  }`}
                >
                  {userType === "admin" ? "Admin-Dashboard" : "Profile"}
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-800"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/")
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/events")
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/equipment-list"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/equipment")
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Equipment
            </Link>
            <Link
              to="/achievements"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/achievements")
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Achievements
            </Link>
            <Link
              to="/profile-page"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/profile")
                  ? "bg-indigo-800 text-white"
                  : "hover:bg-indigo-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
