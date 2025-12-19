// Session List Modal Component
const SessionListModal = ({
  sessions,
  title,
  onClose,
  classMap,
  facilityMap,
}) => {
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Tổng: {sessions.length} buổi
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {sortedSessions.map((session, idx) => {
            const classInfo = classMap[session.classId];
            const facilityInfo = facilityMap[session.facilityId];

            return (
              <div
                key={idx}
                className={`p-3 rounded border ${
                  session.roleInSession === "leader"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">
                        {new Date(session.date).toLocaleDateString("vi-VN")}
                      </span>
                      {session.roleInSession === "leader" && (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                          Trưởng ca
                        </span>
                      )}
                      {session.roleInSession === "assistant" && (
                        <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded">
                          Phụ giảng
                        </span>
                      )}
                      {session.lateMinutes > 0 && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">
                          Trễ {session.lateMinutes} phút
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{classInfo.className}</span>
                      <span className="mx-2">•</span>
                      <span>{facilityInfo.facilityName}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionListModal;