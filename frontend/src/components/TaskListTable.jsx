import React from 'react';
import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');

// Функция для форматирования даты
const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

const TaskListTable = ({ tableData }) => {
  // Функция для определения цвета статусного бейджа
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pending':
        return 'bg-purple-100 text-purple-500 border border-purple-200';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  // Функция для перевода приоритета
  const translatePriority = (priority) => {
    switch (priority) {
      case 'Low':
        return 'Низкий';
      case 'Medium':
        return 'Средний';
      case 'High':
        return 'Высокий';
      default:
        return priority;
    }
  };

  // Функция для перевода статуса
  const translateStatus = (status) => {
    switch (status) {
      case 'In Progress':
        return 'В процессе';
      case 'Completed':
        return 'Завершено';
      case 'Pending':
        return 'Ожидает';
      default:
        return status;
    }
  };

  // Функция для определения цвета приоритетного бейджа
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-500 border border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-500 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Название</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Статус</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">Приоритет</th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="border-t border-gray-200">
              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">{task.title}</td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>
                  {translateStatus(task.status)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                  {translatePriority(task.priority)}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {formatDate(task.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
