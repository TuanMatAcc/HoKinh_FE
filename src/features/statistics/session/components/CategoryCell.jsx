import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ClassDetailButton from "./ClassDetailButton";

// Facility Group
const FacilityGroup = ({
  facilityId,
  classes,
  category,
  bgColor,
  classMap,
  facilityMap,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const facilityInfo = facilityMap[facilityId];
  
  
  const totalSessions = Object.values(classes).reduce(
    (sum, sessions) => sum + sessions.length,
    0
  );
  const classIds = Object.keys(classes);

  return (
    <div className={`${bgColor} rounded p-2 mb-2`}>
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-white hover:bg-opacity-30 rounded p-1 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 flex-1">
          <button className="text-gray-600">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div>
            <div className="font-medium text-sm">
              {facilityInfo.facilityName}
            </div>
            <div className="text-xs text-gray-600">{classIds.length} lớp</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{totalSessions}</span>
          <span className="text-xs text-gray-600">buổi</span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pl-6 space-y-1 border-l-2 border-gray-300 ml-2">
          {classIds.map((classId) => {
            const classInfo = classMap[classId];
            const sessionList = classes[classId];

            return (
              <div
                key={classId}
                className="flex items-center justify-between bg-white/40 rounded p-2"
              >
                <div className="flex-1">
                  <div className="font-medium text-xs">
                    {classInfo.className}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{sessionList.length}</span>
                  <span className="text-xs text-gray-600">buổi</span>
                  <ClassDetailButton
                    sessions={sessionList}
                    classId={classId}
                    facilityId={facilityId}
                    category={category}
                    classMap={classMap}
                    facilityMap={facilityMap}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Category Cell
const CategoryCell = ({
  sessionsByFacility,
  category,
  bgColor,
  classMap,
  facilityMap,
}) => {

  const facilityIds = Object.keys(sessionsByFacility);

  console.log(sessionsByFacility);
  
  if (facilityIds.length === 0) {
    return <div className="text-center text-gray-400 py-4">-</div>;
  }

  return (
    <div className="space-y-2">
      {facilityIds.map((facilityId) => (
        <FacilityGroup
          key={facilityId}
          facilityId={facilityId}
          classes={sessionsByFacility[facilityId]}
          category={category}
          bgColor={bgColor}
          classMap={classMap}
          facilityMap={facilityMap}
        />
      ))}
    </div>
  );
};

export default CategoryCell;
