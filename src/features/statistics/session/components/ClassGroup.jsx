import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import StudentCard from "./StudentCard";

const ClassGroup = ({ classId, className, students, absentThreshold }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const studentsAboveThreshold = students.filter(
    (s) => s.absentPercentage >= absentThreshold
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">{className}</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {students.length} học viên
          </span>
          {studentsAboveThreshold.length > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {studentsAboveThreshold.length} vắng ≥ {absentThreshold}%
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <StudentCard
                key={student.userId}
                student={student}
                absentThreshold={absentThreshold}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassGroup;