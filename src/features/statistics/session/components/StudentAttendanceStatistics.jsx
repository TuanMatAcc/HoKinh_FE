// StudentAttendanceStatistics.jsx
import { useMemo, useState } from "react";
import DonutChart from "./DonutChart";
import StudentDetailModal from "./StudentDetailModal";
import ClassGroup from "./ClassGroup";

const StudentAttendanceStatistics = ({ sessionStatistics, classMap }) => {
  const [absentThreshold, setAbsentThreshold] = useState(20); // Default 20%
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Process data with performance optimization
  const processedData = useMemo(() => {
    if (!sessionStatistics?.studentAttendanceList) return null;

    const studentsAboveThreshold = [];
    const studentsBelowThreshold = [];
    const studentsByClass = {};

    sessionStatistics.studentAttendanceList.forEach((student) => {
      const totalSessions = student.numAttendedSession + student.numAbsentSession;
      if (totalSessions === 0) return;

      const absentPercentage = (student.numAbsentSession / totalSessions) * 100;
      const studentData = {
        ...student,
        totalSessions,
        absentPercentage: absentPercentage.toFixed(2),
      };

      // Categorize by threshold
      if (absentPercentage >= absentThreshold) {
        studentsAboveThreshold.push(studentData);
      } else {
        studentsBelowThreshold.push(studentData);
      }

      // Group by class
      if (!studentsByClass[student.classId]) {
        studentsByClass[student.classId] = [];
      }
      studentsByClass[student.classId].push(studentData);
    });

    // Sort each class by total sessions (descending)
    Object.keys(studentsByClass).forEach((classId) => {
      studentsByClass[classId].sort((a, b) => b.totalSessions - a.totalSessions);
    });

    return {
      studentsAboveThreshold,
      studentsBelowThreshold,
      studentsByClass,
      chartData: [
        {
          label: `< ${absentThreshold}% vắng`,
          value: studentsBelowThreshold.length,
          students: studentsBelowThreshold,
        },
        {
          label: `≥ ${absentThreshold}% vắng`,
          value: studentsAboveThreshold.length,
          students: studentsAboveThreshold,
        },
      ],
    };
  }, [sessionStatistics, absentThreshold]);

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
    setIsModalOpen(true);
  };
  console.log(sessionStatistics);
  

  if (!processedData) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 bg-linear-to-r from-purple-600 to-purple-700">
            <h1 className="text-2xl font-bold text-white">
              Thống kê điểm danh học viên
            </h1>
            <p className="text-purple-100 mt-1">
              Phân tích tỷ lệ vắng mặt của học viên
            </p>
          </div>

          {/* Threshold Control */}
          <div className="p-6 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngưỡng vắng mặt (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={absentThreshold}
                onChange={(e) => setAbsentThreshold(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={absentThreshold}
                onChange={(e) => setAbsentThreshold(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600 font-medium">%</span>
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-6">
            <div className="flex items-center justify-center gap-12">
              <DonutChart
                data={processedData.chartData}
                colors={["#10b981", "#ef4444"]}
                size={280}
                onSegmentClick={handleSegmentClick}
                unit="Võ sinh"
              />

              <div className="space-y-4">
                {processedData.chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                    onClick={() => handleSegmentClick(item)}
                  >
                    <div
                      className="w-6 h-6 rounded"
                      style={{
                        backgroundColor: index === 0 ? "#10b981" : "#ef4444",
                      }}
                    />
                    <div>
                      <div className="text-gray-700 font-medium">
                        {item.label}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {item.value} học viên
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Students by Class */}
        <div className="space-y-4">
          {Object.entries(processedData.studentsByClass)
            .sort(([, a], [, b]) => b.length - a.length)
            .map(([classId, students]) => (
              <ClassGroup
                key={classId}
                classId={classId}
                className={classMap[classId]?.className || `Lớp ${classId}`}
                students={students}
                absentThreshold={absentThreshold}
              />
            ))}
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedSegment && (
        <StudentDetailModal
          segment={selectedSegment}
          absentThreshold={absentThreshold}
          classMap={classMap}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentAttendanceStatistics;