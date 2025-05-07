import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet, LuChevronUp, LuChevronDown, LuX } from "react-icons/lu";
import TaskCard from "../../components/Cards/TaskCard";

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Все");
  const [filterPriority, setFilterPriority] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const PRIORITY_OPTIONS = [
    { label: "Все", value: "All" },
    { label: "Низкий", value: "Low" },
    { label: "Средний", value: "Medium" },
    { label: "Высокий", value: "High" },
  ];

  const STATUS_OPTIONS = [
    { label: "Все", value: "All" },
    { label: "Ожидают", value: "Pending" },
    { label: "В процессе", value: "In Progress" },
    { label: "Завершено", value: "Completed" },
  ];

  const resetFilters = () => {
    setFilterStatus("Все");
    setFilterPriority("All");
    setSearchQuery("");
  };

  const getAllTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {};
      
      if (filterStatus !== "Все") {
        params.status = STATUS_OPTIONS.find(opt => opt.label === filterStatus)?.value;
      }
      
      if (filterPriority !== "All") {
        params.priority = filterPriority;
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, { params });

      if (response.data?.tasks) {
        setAllTasks(response.data.tasks);
      } else {
        setAllTasks([]);
      }

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "Все", count: statusSummary.all || 0 },
        { label: "Ожидают", count: statusSummary.pendingTasks || 0 },
        { label: "В процессе", count: statusSummary.inProgressTasks || 0 },
        { label: "Завершено", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Ошибка при получении задач:", error);
      if (!navigator.onLine) {
        setError("Отсутствует подключение к интернету. Проверьте ваше соединение и попробуйте снова.");
      } else if (error.response) {
        setError("Ошибка сервера. Пожалуйста, попробуйте позже.");
      } else if (error.request) {
        setError("Не удалось получить ответ от сервера. Пожалуйста, попробуйте позже.");
      } else {
        setError("Произошла ошибка при загрузке задач. Пожалуйста, попробуйте снова.");
      }
      setAllTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`);
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus, filterPriority, searchQuery]);

  return (
    <DashboardLayout activeMenu="Мои задачи">
      <div className="my-3">
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Поиск задач..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-8 h-[38px]"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.label}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col -space-y-1">
                  {STATUS_OPTIONS.findIndex(opt => opt.label === filterStatus) > 0 && (
                    <LuChevronUp 
                      className="text-lg cursor-pointer hover:text-primary" 
                      onClick={() => {
                        const currentIndex = STATUS_OPTIONS.findIndex(opt => opt.label === filterStatus);
                        setFilterStatus(STATUS_OPTIONS[currentIndex - 1].label);
                      }} 
                    />
                  )}
                  {STATUS_OPTIONS.findIndex(opt => opt.label === filterStatus) < STATUS_OPTIONS.length - 1 && (
                    <LuChevronDown 
                      className="text-lg cursor-pointer hover:text-primary" 
                      onClick={() => {
                        const currentIndex = STATUS_OPTIONS.findIndex(opt => opt.label === filterStatus);
                        setFilterStatus(STATUS_OPTIONS[currentIndex + 1].label);
                      }} 
                    />
                  )}
                </div>
              </div>

              <div className="relative">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="appearance-none px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary pr-8 h-[38px]"
                >
                  {PRIORITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col -space-y-1">
                  {PRIORITY_OPTIONS.findIndex(opt => opt.value === filterPriority) > 0 && (
                    <LuChevronUp 
                      className="text-lg cursor-pointer hover:text-primary" 
                      onClick={() => {
                        const currentIndex = PRIORITY_OPTIONS.findIndex(opt => opt.value === filterPriority);
                        setFilterPriority(PRIORITY_OPTIONS[currentIndex - 1].value);
                      }} 
                    />
                  )}
                  {PRIORITY_OPTIONS.findIndex(opt => opt.value === filterPriority) < PRIORITY_OPTIONS.length - 1 && (
                    <LuChevronDown 
                      className="text-lg cursor-pointer hover:text-primary" 
                      onClick={() => {
                        const currentIndex = PRIORITY_OPTIONS.findIndex(opt => opt.value === filterPriority);
                        setFilterPriority(PRIORITY_OPTIONS[currentIndex + 1].value);
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <LuWifiOff className="text-4xl text-red-500" />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Загрузка задач...
          </div>
        ) : allTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Задачи не найдены. Попробуйте изменить параметры фильтрации.</p>
            {(filterStatus !== "Все" || filterPriority !== "All" || searchQuery) && (
              <button 
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 mx-auto"
                onClick={resetFilters}
              >
                <LuX className="text-lg" />
                Сбросить фильтры
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allTasks.map((item) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => handleClick(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
