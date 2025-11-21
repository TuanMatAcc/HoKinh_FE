import {
  Calendar,
  Clock
} from "lucide-react";

// Class Overview Card Component
const ClassOverviewCard = ({ classData }) => (
  <div className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition">
    <h4 className="font-semibold text-blue-900 mb-3">{classData.name}</h4>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-600" />
        <span className="text-xs text-gray-600">Cập nhật:</span>
        <span className="text-sm text-blue-700">
          {classData.sessionsUpdatedAt}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-green-600" />
        <span className="text-xs text-gray-600">Buổi xa nhất:</span>
        <span className="text-sm text-green-700 font-medium">
          {classData.latestSession}
        </span>
      </div>
    </div>
  </div>
);
// Session Overview Panel Component
const SessionOverviewPanel = ({ facilities }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">
        Tổng Quan Buổi Học
      </h2>
      <div className="space-y-6">
        {facilities.map((facility) => (
          <div key={facility.id}>
            <h3 className="text-sm font-semibold text-blue-900 mb-3">
              {facility.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facility.classes.length > 0 ? (
                facility.classes.map((classData) => (
                  <ClassOverviewCard key={classData.id} classData={classData} />
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-3">
                  Chưa có lớp học
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionOverviewPanel;
