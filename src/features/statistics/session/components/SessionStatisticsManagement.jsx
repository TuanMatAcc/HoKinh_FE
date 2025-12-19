import { useEffect, useMemo, useState } from "react";
import CategoryCell from "./CategoryCell";
import { useSessionStatistics } from "../../../../hooks/useSessionStatistics";
import UserSessionStatisticsDetailPage from "../../../../pages/DetailInstructorSessionStatistics";
import StudentAttendanceStatistics from "./StudentAttendanceStatistics";
import { ThreeDotLoader } from "../../../../components/ActionFallback";

// Mobile Card View Component
const UserCard = ({
  setIsChildComponent,
  user,
  classMap,
  facilityMap,
  setView,
  setSelectedUser,
}) => {
  const processedData = useMemo(() => {
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

    return { presence, suddenAbsence, authorizedAbsence };
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="font-semibold text-gray-900 text-lg mb-4 pb-3 border-b">
        {user.userName}
      </div>

      <div className="flex space-y-3">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Có mặt</div>
          <CategoryCell
            sessionsByFacility={processedData.presence}
            category="presence"
            bgColor="bg-green-50"
            classMap={classMap}
            facilityMap={facilityMap}
          />
        </div>

        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">
            Vắng đột xuất
          </div>
          <CategoryCell
            sessionsByFacility={processedData.suddenAbsence}
            category="suddenAbsence"
            bgColor="bg-red-50"
            classMap={classMap}
            facilityMap={facilityMap}
          />
        </div>

        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">
            Vắng có báo trước
          </div>
          <CategoryCell
            sessionsByFacility={processedData.authorizedAbsence}
            category="authorizedAbsence"
            bgColor="bg-yellow-50"
            classMap={classMap}
            facilityMap={facilityMap}
          />
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedUser(user);
          setView("user");
          setIsChildComponent(true);
        }}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        Xem chi tiết
      </button>
    </div>
  );
};

// Desktop Table Row Component
const UserRow = ({
  setIsChildComponent,
  user,
  classMap,
  facilityMap,
  setView,
  setSelectedUser,
}) => {
  const processedData = useMemo(() => {
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

    return { presence, suddenAbsence, authorizedAbsence };
  }, [user]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 border-b align-top">
        <div className="font-medium text-gray-900">{user.userName}</div>
      </td>
      <td className="px-4 py-3 border-b align-top">
        <CategoryCell
          sessionsByFacility={processedData.presence}
          category="presence"
          bgColor="bg-green-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </td>

      <td className="px-4 py-3 border-b align-top">
        <CategoryCell
          sessionsByFacility={processedData.suddenAbsence}
          category="suddenAbsence"
          bgColor="bg-red-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </td>

      <td className="px-4 py-3 border-b align-top">
        <CategoryCell
          sessionsByFacility={processedData.authorizedAbsence}
          category="authorizedAbsence"
          bgColor="bg-yellow-50"
          classMap={classMap}
          facilityMap={facilityMap}
        />
      </td>

      <td className="px-4 py-3 border-b text-center align-top">
        <button
          onClick={() => {
            setSelectedUser(user);
            setView("user");
            setIsChildComponent(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
        >
          Xem chi tiết
        </button>
      </td>
    </tr>
  );
};

// Main Component
const SessionStatisticsUI = ({
  setIsChildComponent,
  startDate,
  endDate,
  facilityMap,
  classMap,
  selectedFacility,
}) => {
  const [view, setView] = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: sessionStatistics } = useSessionStatistics(
    selectedFacility,
    startDate,
    endDate
  );
  const [inProgress, setInProgress] = useState("");

  useEffect(() => {
    if (!(facilityMap && startDate && endDate)) {
      setInProgress("");
    } else if (!sessionStatistics?.data) {
      setInProgress("Đang tải dữ liệu. Vui lòng chờ");
    } else {
      setInProgress("");
    }
  }, [sessionStatistics, facilityMap, startDate, endDate]);

  if (view === "users") {
    return (
      <>
        {inProgress && <ThreeDotLoader message={inProgress} />}
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-6 bg-linear-to-r from-blue-600 to-blue-700">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Thống kê điểm danh giảng viên
                </h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                  Tổng hợp thông tin tham gia buổi học
                </p>
              </div>

              {/* Desktop Table View (hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Giảng viên
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Có mặt
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Vắng đột xuất
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">
                        Vắng có báo trước
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700 border-b">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionStatistics?.data &&
                      sessionStatistics.data.instructorSessionStatistics.map(
                        (user) => (
                          <UserRow
                            key={user.userId}
                            setIsChildComponent={setIsChildComponent}
                            user={user}
                            classMap={classMap || {}}
                            facilityMap={facilityMap || {}}
                            setSelectedUser={setSelectedUser}
                            setView={setView}
                          />
                        )
                      )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (visible on mobile only) */}
              <div className="md:hidden p-4 overflow-x-auto">
                {sessionStatistics?.data &&
                  sessionStatistics.data.instructorSessionStatistics.map(
                    (user) => (
                      <UserCard
                        key={user.userId}
                        setIsChildComponent={setIsChildComponent}
                        user={user}
                        classMap={classMap || {}}
                        facilityMap={facilityMap || {}}
                        setSelectedUser={setSelectedUser}
                        setView={setView}
                      />
                    )
                  )}
              </div>
            </div>

            {/* Student Attendance Statistics */}
            {sessionStatistics?.data && (
              <StudentAttendanceStatistics
                sessionStatistics={sessionStatistics.data}
                classMap={classMap}
              />
            )}
          </div>
        </div>
      </>
    );
  } else if (view === "user") {
    return (
      <UserSessionStatisticsDetailPage
        user={selectedUser}
        setView={setView}
        setIsChildComponent={setIsChildComponent}
        setSelectedUser={setSelectedUser}
        facilityMap={facilityMap}
        classMap={classMap}
      />
    );
  }
};

export default SessionStatisticsUI;
