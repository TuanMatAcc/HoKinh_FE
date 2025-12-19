import { useState, useMemo } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import DonutChart from "../../features/statistics/session/components/DonutChart";
import ChartLegend from "../../features/statistics/session/components/ChartLegend";
import CategoryCell from "../../features/statistics/session/components/CategoryCell";
import SessionListModal from "../../features/statistics/session/components/SessionListModal";

// Main Detail Page Component
const SessionStatisticsDetailPageForInstructor = ({
  user,
  facilityMap,
  classMap,
  setView,
  setIsChildComponent,
}) => {
  // const { user, classMap, facilityMap } = generateMockData();
  const [lateThreshold, setLateThreshold] = useState(15);
  const [sessionListModal, setSessionListModal] = useState(null);
  console.log("hahahaah");
  
  const statistics = useMemo(() => {
    const presence = {};
    const suddenAbsence = {};
    const authorizedAbsence = {};

    user.presentSessions.forEach((session) => {
      const facilityId = session.facilityId;
      const classId = session.classId;

      if (!presence[facilityId]) presence[facilityId] = {};
      if (!presence[facilityId][classId]) presence[facilityId][classId] = [];
      presence[facilityId][classId].push(session);
    });

    user.absentSessions.forEach((session) => {
      const facilityId = session.facilityId;
      const classId = session.classId;

      if (session.roleInSession === "off") {
        if (!authorizedAbsence[facilityId]) authorizedAbsence[facilityId] = {};
        if (!authorizedAbsence[facilityId][classId])
          authorizedAbsence[facilityId][classId] = [];
        authorizedAbsence[facilityId][classId].push(session);
      } else {
        if (!suddenAbsence[facilityId]) suddenAbsence[facilityId] = {};
        if (!suddenAbsence[facilityId][classId])
          suddenAbsence[facilityId][classId] = [];
        suddenAbsence[facilityId][classId].push(session);
      }
    });

    // Attendance statistics
    const presentCount = user.presentSessions.length;
    const suddenAbsenceCount = user.absentSessions.filter(
      (s) => s.roleInSession !== "off"
    ).length;
    const authorizedAbsenceCount = user.absentSessions.filter(
      (s) => s.roleInSession === "off"
    ).length;
    const totalSessions =
      presentCount + suddenAbsenceCount + authorizedAbsenceCount;

    // Late statistics
    const onTimeCount = user.presentSessions.filter(
      (s) => s.lateMinutes < lateThreshold
    ).length;
    const lateCount = user.presentSessions.filter(
      (s) => s.lateMinutes >= lateThreshold
    ).length;

    return {
      presence,
      suddenAbsence,
      authorizedAbsence,
      attendanceData: {
        present: presentCount,
        suddenAbsence: suddenAbsenceCount,
        authorizedAbsence: authorizedAbsenceCount,
        total: totalSessions,
      },
      lateData: {
        onTime: onTimeCount,
        late: lateCount,
        total: presentCount,
      },
    };
  }, [user, lateThreshold]);

  const handleAttendanceSegmentClick = (segment) => {
    let sessions = [];
    let title = "";

    if (segment.label === "Có mặt") {
      sessions = user.presentSessions;
      title = "Danh sách buổi có mặt";
    } else if (segment.label === "Vắng đột xuất") {
      sessions = user.absentSessions.filter((s) => s.roleInSession !== "off");
      title = "Danh sách buổi vắng đột xuất";
    } else if (segment.label === "Vắng có báo") {
      sessions = user.absentSessions.filter((s) => s.roleInSession === "off");
      title = "Danh sách buổi vắng có báo trước";
    }

    setSessionListModal({ sessions, title });
  };

  const handleLateSegmentClick = (segment) => {
    let sessions = [];
    let title = "";

    if (segment.label === "Đúng giờ") {
      sessions = user.presentSessions.filter(
        (s) => s.lateMinutes < lateThreshold
      );
      title = `Danh sách buổi check in đúng giờ (< ${lateThreshold} phút)`;
    } else if (segment.label === "Trễ") {
      sessions = user.presentSessions.filter(
        (s) => s.lateMinutes >= lateThreshold
      );
      title = `Danh sách buổi check in (≥ ${lateThreshold} phút)`;
    }

    setSessionListModal({ sessions, title });
  };

  const attendanceChartData = [
    {
      value: statistics.attendanceData.present,
      label: "Có mặt",
      color: "#22c55e",
    },
    {
      value: statistics.attendanceData.suddenAbsence,
      label: "Vắng đột xuất",
      color: "#ef4444",
    },
    {
      value: statistics.attendanceData.authorizedAbsence,
      label: "Vắng có báo",
      color: "#f59e0b",
    },
  ];

  const lateChartData = [
    { value: statistics.lateData.onTime, label: "Đúng giờ", color: "#22c55e" },
    { value: statistics.lateData.late, label: "Trễ", color: "#ef4444" },
  ];

  const attendanceLegend = attendanceChartData.map((item) => ({
    ...item,
    percentage:
      statistics.attendanceData.total > 0
        ? (item.value / statistics.attendanceData.total) * 100
        : 0,
  }));

  const lateLegend = lateChartData.map((item) => ({
    ...item,
    percentage:
      statistics.lateData.total > 0
        ? (item.value / statistics.lateData.total) * 100
        : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => {
              setView("users");
              setIsChildComponent(false);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mt-1">
              Chi tiết thống kê tham gia buổi học
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 mb-6">
          {/* Attendance Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Thống kê tham gia
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Nhấn vào từng phần để xem chi tiết
            </p>
            <DonutChart
              data={attendanceChartData}
              colors={attendanceChartData.map((d) => d.color)}
              size={240}
              onSegmentClick={handleAttendanceSegmentClick}
            />
            <div className="mt-6">
              <ChartLegend items={attendanceLegend} />
            </div>
          </div>

          {/* Late Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                Thống kê Check in
              </h2>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Ngưỡng:</span>
                <input
                  type="number"
                  value={lateThreshold}
                  onChange={(e) =>
                    setLateThreshold(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="w-16 px-2 py-1 border rounded text-sm"
                  min="0"
                />
                <span className="text-sm text-gray-600">phút</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Nhấn vào từng phần để xem chi tiết
            </p>
            <DonutChart
              data={lateChartData}
              colors={lateChartData.map((d) => d.color)}
              size={240}
              onSegmentClick={handleLateSegmentClick}
            />
            <div className="mt-6">
              <ChartLegend items={lateLegend} />
            </div>
          </div>
        </div>

        {/* Sessions Detail */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Chi tiết buổi học
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Present Sessions */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                Có mặt
              </h3>
              <CategoryCell
                sessionsByFacility={statistics.presence}
                category="presence"
                bgColor="bg-green-50"
                classMap={classMap}
                facilityMap={facilityMap}
              />
            </div>

            {/* Sudden Absence */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Vắng đột xuất
              </h3>
              <CategoryCell
                sessionsByFacility={statistics.suddenAbsence}
                category="suddenAbsence"
                bgColor="bg-red-50"
                classMap={classMap}
                facilityMap={facilityMap}
              />
            </div>

            {/* Authorized Absence */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                Vắng có báo trước
              </h3>
              <CategoryCell
                sessionsByFacility={statistics.authorizedAbsence}
                category="authorizedAbsence"
                bgColor="bg-yellow-50"
                classMap={classMap}
                facilityMap={facilityMap}
              />
            </div>
          </div>
        </div>

        {/* Session List Modal */}
        {sessionListModal && (
          <SessionListModal
            sessions={sessionListModal.sessions}
            title={sessionListModal.title}
            classMap={classMap}
            facilityMap={facilityMap}
            onClose={() => setSessionListModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SessionStatisticsDetailPageForInstructor;