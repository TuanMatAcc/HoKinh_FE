import { useMemo, useState } from "react";
import CategoryCell from "../CategoryCell";
import SessionStatisticsDetailPageForInstructor from "../../../../../pages/Instructor/DetailSessionStatisticsForInstructor";
import { CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";

// Mobile Card View Component
const MobileUserCard = ({
  setIsChildComponent,
  user,
  classMap,
  facilityMap,
  setView,
  processedData,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Present Sessions */}
      <div className="p-4 border-b bg-green-50">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <h3 className="font-semibold text-gray-900 text-sm">Có mặt</h3>
        </div>
        <CategoryCell
          sessionsByFacility={processedData.presence}
          category="presence"
          bgColor="bg-green-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </div>

      {/* Sudden Absence */}
      <div className="p-4 border-b bg-red-50">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <h3 className="font-semibold text-gray-900 text-sm">Vắng đột xuất</h3>
        </div>
        <CategoryCell
          sessionsByFacility={processedData.suddenAbsence}
          category="suddenAbsence"
          bgColor="bg-red-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </div>

      {/* Authorized Absence */}
      <div className="p-4 border-b bg-yellow-50">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <h3 className="font-semibold text-gray-900 text-sm">
            Vắng có báo trước
          </h3>
        </div>
        <CategoryCell
          sessionsByFacility={processedData.authorizedAbsence}
          category="authorizedAbsence"
          bgColor="bg-yellow-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </div>

      {/* Action Button */}
      <div className="p-4 bg-gray-50">
        <button
          onClick={() => {
            setView("user");
            setIsChildComponent(true);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Eye className="w-4 h-4" />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

// Desktop Table Row Component
const UserRow = ({
  setIsChildComponent,
  classMap,
  facilityMap,
  setView,
  processedData,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-3 sm:px-4 py-3 border-b align-top">
        <CategoryCell
          sessionsByFacility={processedData.presence}
          category="presence"
          bgColor="bg-green-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </td>
      <td className="px-3 sm:px-4 py-3 border-b align-top">
        <CategoryCell
          sessionsByFacility={processedData.suddenAbsence}
          category="suddenAbsence"
          bgColor="bg-red-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </td>
      <td className="px-3 sm:px-4 py-3 border-b align-top">
        <CategoryCell
          sessionsByFacility={processedData.authorizedAbsence}
          category="authorizedAbsence"
          bgColor="bg-yellow-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </td>
      <td className="px-3 sm:px-4 py-3 border-b text-center align-top">
        <button
          onClick={() => {
            setView("user");
            setIsChildComponent(true);
          }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Xem chi tiết</span>
          <span className="sm:hidden">Chi tiết</span>
        </button>
      </td>
    </tr>
  );
};

const SessionStatisticsForInstructorUI = ({
  setIsChildComponent,
  facilityMap,
  classMap,
  sessionStatistics,
}) => {
  const [view, setView] = useState("users");

  // Process data once for both mobile and desktop views
  const processedData = useMemo(() => {
    if (!sessionStatistics)
      return { presence: {}, suddenAbsence: {}, authorizedAbsence: {} };

    const presence = {};
    const suddenAbsence = {};
    const authorizedAbsence = {};

    // Process present sessions
    sessionStatistics.presentSessions?.forEach((session) => {
      const facilityId = session.facilityId;
      const classId = session.classId;
      if (!presence[facilityId]) presence[facilityId] = {};
      if (!presence[facilityId][classId]) presence[facilityId][classId] = [];
      presence[facilityId][classId].push(session);
    });

    // Process absent sessions
    sessionStatistics.absentSessions?.forEach((session) => {
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

    return { presence, suddenAbsence, authorizedAbsence };
  }, [sessionStatistics]);

  if (view === "users") {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 bg-linear-to-r from-blue-600 to-blue-700">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Thống kê điểm danh giảng viên
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Tổng hợp thông tin tham gia buổi học
              </p>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block md:hidden p-3 sm:p-4">
              {sessionStatistics && (
                <MobileUserCard
                  setIsChildComponent={setIsChildComponent}
                  user={sessionStatistics}
                  classMap={classMap}
                  facilityMap={facilityMap}
                  setView={setView}
                  processedData={processedData}
                />
              )}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                      Có mặt
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                      Vắng đột xuất
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-b">
                      Vắng có báo trước
                    </th>
                    <th className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 border-b">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessionStatistics && (
                    <UserRow
                      setIsChildComponent={setIsChildComponent}
                      user={sessionStatistics}
                      classMap={classMap}
                      facilityMap={facilityMap}
                      setView={setView}
                      processedData={processedData}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (view === "user") {
    return (
      <SessionStatisticsDetailPageForInstructor
        user={sessionStatistics}
        setView={setView}
        setIsChildComponent={setIsChildComponent}
        facilityMap={facilityMap}
        classMap={classMap}
      />
    );
  }
};

export default SessionStatisticsForInstructorUI;
