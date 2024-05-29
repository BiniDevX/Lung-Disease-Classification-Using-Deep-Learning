import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 px-4 py-2 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-gray-200">AILab</h1>
        </div>
        <div className="flex space-x-4">
          <NavLink
            to="/"
            end // Use `end` for exact path matching in React Router v6+
            className={`text-gray-300 hover:text-blue-300 transition duration-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:text-blue-400`}
          >
            Home
          </NavLink>
          <NavLink
            to="/diseases"
            className={`text-gray-300 hover:text-blue-300 transition duration-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:text-blue-400`}
          >
            Diseases Covered
          </NavLink>
          <NavLink
            to="/login"
            className={`text-gray-300 hover:text-blue-300 transition duration-200 px-3 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:text-blue-400`}
          >
            Log In
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
