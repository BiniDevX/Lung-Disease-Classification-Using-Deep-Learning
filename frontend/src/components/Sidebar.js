import React from "react";

const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-blue-500 text-white">
      <ul className="space-y-2 p-2">
        <li>
          <a href="/profile" className="block p-3 hover:bg-blue-700">
            User Profile
          </a>
        </li>
        <li>
          <a href="/manage-patients" className="block p-3 hover:bg-blue-700">
            Manage Patient
          </a>
        </li>
        <li>
          <a href="/register-patient" className="block p-3 hover:bg-blue-700">
            Register New Patient
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
