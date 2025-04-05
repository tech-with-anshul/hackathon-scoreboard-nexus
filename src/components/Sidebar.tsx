
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Award, BarChart3, ClipboardList, Users, FileJson, Home } from 'lucide-react';

const Sidebar = () => {
  const { role } = useAuth();

  const isAdmin = role === 'admin';
  const isJudge = role === 'judge';

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              isActive ? "bg-slate-100 text-gray-900" : ""
            )
          }
        >
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>

        {isAdmin && (
          <>
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  isActive ? "bg-slate-100 text-gray-900" : ""
                )
              }
            >
              <Users size={18} />
              <span>Teams</span>
            </NavLink>

            <NavLink
              to="/judges"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  isActive ? "bg-slate-100 text-gray-900" : ""
                )
              }
            >
              <Award size={18} />
              <span>Judges</span>
            </NavLink>

            <NavLink
              to="/import"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  isActive ? "bg-slate-100 text-gray-900" : ""
                )
              }
            >
              <FileJson size={18} />
              <span>Import Data</span>
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  isActive ? "bg-slate-100 text-gray-900" : ""
                )
              }
            >
              <BarChart3 size={18} />
              <span>Results</span>
            </NavLink>
          </>
        )}

        {isJudge && (
          <NavLink
            to="/evaluate"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                isActive ? "bg-slate-100 text-gray-900" : ""
              )
            }
          >
            <ClipboardList size={18} />
            <span>Evaluate Teams</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
