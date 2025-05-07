import React from "react";

const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card p-2 border border-gray-300 rounded-md">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <img
            src={userInfo?.profileImageUrl || "/default-avatar.png"}
            alt={`Avatar`}
            className="w-12 h-12 rounded-full border-2 border-white"
          />

          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-2 mt-4">
        <StatCard
          label="Ожидает"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="В процессе"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Завершено"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

const StatCard = ({ label, count, status }) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-indigo-500 bg-gray-50";
      default:
        return "text-violet-500 bg-gray-50";
    }
  };

  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-2 py-0.5 rounded text-center`}
    >
      <span className="text-[12px] font-semibold">{count}</span>
      <span className="block whitespace-nowrap">{label}</span>
    </div>
  );
};

export default UserCard;
