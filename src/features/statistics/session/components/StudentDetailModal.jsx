// ==========================================
// StudentDetailModal.jsx
// ==========================================
import { X, User, TrendingUp } from "lucide-react";

const StudentDetailModal = ({
  segment,
  absentThreshold,
  classMap,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-purple-600 to-purple-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{segment.label}</h2>
            <p className="text-purple-100 mt-1">
              {segment.value} học viên trong nhóm này
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-3">
            {segment.students
              .sort((a, b) => b.totalSessions - a.totalSessions)
              .map((student) => (
                <div
                  key={student.userId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <User className="w-5 h-5 text-gray-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {student.studentName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            ({student.userId})
                          </span>
                          {!student.isActive && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                              Bảo lưu
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          Lớp:{" "}
                          {classMap[student.classId]?.className ||
                            `Lớp ${student.classId}`}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-gray-500">
                              Tổng buổi
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              {student.totalSessions}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Có mặt</div>
                            <div className="text-lg font-bold text-green-600">
                              {student.numAttendedSession}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Vắng</div>
                            <div className="text-lg font-bold text-red-600">
                              {student.numAbsentSession}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Tỷ lệ điểm danh:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {(
                                (student.numAttendedSession /
                                  student.totalSessions) *
                                100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{
                                width: `${
                                  (student.numAttendedSession /
                                    student.totalSessions) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-xs text-gray-500 mb-1">
                        Tỷ lệ vắng
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          student.absentPercentage >= absentThreshold
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {student.absentPercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;