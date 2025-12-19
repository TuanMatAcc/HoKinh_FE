import { useState } from "react";
import { Eye } from "lucide-react";

// Session Detail Modal
const SessionDetailModal = ({
  sessions,
  classId,
  facilityId,
  category,
  classMap,
  facilityMap,
  onClose,
}) => {
  const classInfo = classMap[classId];
  const facilityInfo = facilityMap[facilityId];
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const categoryLabel = {
    presence: "Có mặt",
    suddenAbsence: "Vắng đột xuất",
    authorizedAbsence: "Vắng có báo trước",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{classInfo.className}</h3>
            <p className="text-gray-600">{facilityInfo.facilityName}</p>
            <p className="text-sm text-gray-500 mt-1">
              {categoryLabel[category]}
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
          {sortedSessions.map((session, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border ${
                session.roleInSession === "leader"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
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
                </div>
                {session.lateMinutes > 0 && (
                  <span className="text-orange-600 text-sm">
                    Trễ {session.lateMinutes} phút
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Class Detail Button
const ClassDetailButton = ({
  sessions,
  classId,
  facilityId,
  category,
  classMap,
  facilityMap,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
        title="Xem chi tiết lớp"
      >
        <Eye size={14} />
      </button>

      {showModal && (
        <SessionDetailModal
          sessions={sessions}
          classId={classId}
          facilityId={facilityId}
          category={category}
          classMap={classMap}
          facilityMap={facilityMap}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ClassDetailButton;