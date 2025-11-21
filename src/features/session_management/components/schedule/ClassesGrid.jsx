import getDay from "../../../../utils/getVietnameseDay"; 
import {
  Calendar,
  Clock,
} from "lucide-react";

const ClassesGrid = ({setSelectedClass, setView, filteredClasses}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredClasses.map((cls) => (
      <div
        key={cls.id}
        onClick={() => {
          setSelectedClass(cls);
          setView("schedule");
        }}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-400"
      >
        <h3 className="text-xl font-bold text-blue-900 mb-4">{cls.name}</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Ngày học</p>
              <p className="text-blue-900 font-medium">
                {cls.daysOfWeek
                  .split("-")
                  .map((d) => getDay(d))
                  .join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-600 mb-1">Giờ học</p>
              <p className="text-blue-900 font-medium">
                {cls.startTime} - {cls.endTime}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Buổi học mới nhất</p>
            <p className="text-blue-900 font-semibold">{cls.latestSession}</p>
          </div>
        </div>

        <button
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          onClick={() => {
            setSelectedClass(cls);
            setView("schedule");
          }}
        >
          Xem Thời Khóa Biểu
        </button>
      </div>
    ))}
  </div>
);

export default ClassesGrid;