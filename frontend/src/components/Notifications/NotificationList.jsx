import React, { useEffect, useState } from 'react';
import { LuBell, LuX } from 'react-icons/lu';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const NotificationList = ({ notifications, onClose, onNotificationClick }) => {
  const [localNotifications, setLocalNotifications] = useState([]);

  useEffect(() => {
    // Получаем уведомления из локального хранилища
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setLocalNotifications(storedNotifications);
  }, [notifications]); // Обновляем при изменении пропса notifications

  const handleNotificationClick = (notification) => {
    // Отмечаем уведомление как прочитанное
    const updatedNotifications = localNotifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    
    // Сохраняем обновленный список
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setLocalNotifications(updatedNotifications);
    
    // Вызываем обработчик клика
    onNotificationClick(notification);
  };

  if (!localNotifications || localNotifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Нет новых уведомлений
      </div>
    );
  }

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuBell className="text-primary" />
          <h3 className="font-medium">Уведомления</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <LuX className="text-gray-500" />
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {localNotifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ru
                  })}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList; 