import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLayoutDashboard, LuUsers, LuClipboardList, LuSettings, LuLogOut, LuChevronLeft, LuChevronRight, LuPlus, LuUser } from "react-icons/lu";
import { UserContext } from "../../context/userContext";

const SideMenu = ({ activeMenu, isExpanded, onToggleExpand }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const adminMenuItems = [
    {
      label: "Панель управления",
      icon: <LuLayoutDashboard className="text-xl" />,
      path: "/admin/dashboard",
    },
    {
      label: "Пользователи",
      icon: <LuUsers className="text-xl" />,
      path: "/admin/users",
    },
    {
      label: "Управлять задачами",
      icon: <LuClipboardList className="text-xl" />,
      path: "/admin/tasks",
    },
    {
      label: "Создать задачу",
      icon: <LuPlus className="text-xl" />,
      path: "/admin/create-task",
    },
    {
      label: "Настройки",
      icon: <LuSettings className="text-xl" />,
      path: "/admin/settings",
    },
  ];

  const userMenuItems = [
    {
      label: "Панель управления",
      icon: <LuLayoutDashboard className="text-xl" />,
      path: "/user/dashboard",
    },
    {
      label: "Мои задачи",
      icon: <LuClipboardList className="text-xl" />,
      path: "/user/my-tasks",
    },
    {
      label: "Настройки",
      icon: <LuSettings className="text-xl" />,
      path: "/user/settings",
    },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : userMenuItems;

  return (
    <div className="h-full bg-white shadow-sm">
      {/* Профиль пользователя */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-3">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <LuUser className="text-gray-400" />
            </div>
          )}
          {isExpanded && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.role === "admin" ? "Администратор" : "Пользователь"}</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleExpand}
          className="p-2 hover:bg-gray-50 rounded-md"
        >
          {isExpanded ? (
            <LuChevronLeft className="text-xl" />
          ) : (
            <LuChevronRight className="text-xl" />
          )}
        </button>
      </div>

      {/* Меню */}
      <div className="py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 ${
              activeMenu === item.label ? "bg-gray-50 text-primary" : ""
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isExpanded && (
              <span className="ml-3">{item.label}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Кнопка выхода */}
      <div className="absolute bottom-0 w-full border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
        >
          <LuLogOut className="text-xl" />
          {isExpanded && (
            <span className="ml-3">Выйти</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
