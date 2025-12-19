// ==========================================
// StudentCard.jsx
// ==========================================
import { User, AlertCircle } from "lucide-react";

const StudentCard = ({ student, absentThreshold }) => {
  const isHighAbsent = student.absentPercentage >= absentThreshold;

  return (
    <div
      className={`bg-white rounded-lg border-2 p-4 transition-all hover:shadow-md ${
        isHighAbsent ? "border-red-300" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <div className="font-semibold text-gray-900">
              {student.studentName}
            </div>
            <div className="text-sm text-gray-500">{student.userId}</div>
          </div>
        </div>
        {!student.isActive && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
            Bảo lưu
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tổng buổi học:</span>
          <span className="font-semibold text-gray-900">
            {student.totalSessions}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Có mặt:</span>
          <span className="font-semibold text-green-600">
            {student.numAttendedSession}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Vắng:</span>
          <span className="font-semibold text-red-600">
            {student.numAbsentSession}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tỷ lệ vắng:</span>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold ${
                isHighAbsent ? "text-red-600" : "text-gray-900"
              }`}
            >
              {student.absentPercentage}%
            </span>
            {isHighAbsent && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isHighAbsent ? "bg-red-500" : "bg-green-500"
            }`}
            style={{
              width: `${
                (student.numAttendedSession / student.totalSessions) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentCard;