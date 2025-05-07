import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import { LuBell } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import NotificationList from "../Notifications/NotificationList";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const fetchNotifications = async () => {
    try {
      // Получаем уведомления из локального хранилища
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      
      // Фильтруем уведомления в зависимости от роли пользователя
      const filteredNotifications = storedNotifications.filter(notification => {
        if (user.role === 'admin') {
          // Админ видит все уведомления о созданных задачах
          return notification.message.includes('успешно создана');
        } else {
          // Обычный пользователь видит только уведомления, где он назначен
          return notification.assignedTo?.includes(user._id);
        }
      });

      setNotifications(filteredNotifications);
      setUnreadCount(filteredNotifications.filter(n => !n.read).length);

      // Также получаем уведомления с сервера
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_NOTIFICATIONS);
      if (response.data) {
        // Объединяем серверные и локальные уведомления
        const serverNotifications = response.data.notifications || [];
        const allNotifications = [...filteredNotifications, ...serverNotifications];
        
        // Удаляем дубликаты по taskId
        const uniqueNotifications = Array.from(
          new Map(allNotifications.map(n => [n.taskId, n])).values()
        );
        
        // Сортируем по дате создания (новые сверху)
        uniqueNotifications.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setNotifications(uniqueNotifications);
        setUnreadCount(uniqueNotifications.filter(n => !n.read).length);
        
        // Сохраняем обновленный список
        localStorage.setItem('notifications', JSON.stringify(uniqueNotifications));
      }
    } catch (error) {
      console.error("Ошибка при получении уведомлений:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Если уведомление связано с задачей, переходим к ней
    if (notification.taskId) {
      if (user.role === 'admin') {
        navigate(`/admin/task-details/${notification.taskId}`);
      } else {
        navigate(`/user/task-details/${notification.taskId}`);
      }
    }
    setShowNotifications(false);
  };

  useEffect(() => {
    fetchNotifications();
    // Проверяем новые уведомления каждые 30 секунд
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]); // Добавляем user в зависимости, чтобы обновлять при изменении пользователя

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Боковая панель */}
      <div 
        className={`fixed top-0 left-0 h-full transition-all duration-300 ${
          isSidebarExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <SideMenu 
          activeMenu={activeMenu} 
          isExpanded={isSidebarExpanded} 
          onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
      </div>
      
      {/* Основной контент */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        {/* Хедер */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
          <h1 className="text-xl font-semibold">StellarPlan</h1>
          
          {/* Уведомления */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <LuBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 z-50">
                <NotificationList
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onNotificationClick={handleNotificationClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Контент страницы */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
