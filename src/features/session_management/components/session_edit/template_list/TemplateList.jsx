import { useState } from "react";
import TemplateCard from "./TemplateCard";

// Templates List Component
const TemplatesList = ({ templates, onToggleStatus, onToggleRole, onDeleteMembers, onAddMembers, onTimeChange }) => {

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-900">
            Danh Sách Template Buổi Học
          </h2>
        </div>
        <p className="text-center text-gray-500 py-8">
          Chưa có template nào. Vui lòng chọn ngày trong tuần để tạo template.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-900">
            Danh Sách Template Buổi Học
          </h2>
          <span className="text-sm text-purple-600 font-medium">
            Tổng: {templates.length} template
          </span>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.dayOfWeek}
              template={template}
              onDeleteMembers={onDeleteMembers}
              onAdd={onAddMembers}
              onToggleStatus={onToggleStatus}
              onToggleRole={onToggleRole}
              onTimeChange={onTimeChange}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default TemplatesList;
