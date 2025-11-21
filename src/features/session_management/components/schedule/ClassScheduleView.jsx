import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  UserCheck,
  UserX,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  ArrowLeft,
  X
} from "lucide-react";
import Header from "../../../../components/Header";
import getDay from "../../../../utils/getVietnameseDay";
import WeeklySessionsGrid from "./WeeklySessionsGrid";

const ClassScheduleView = ({setSelectedClass, setView, selectedClass}) => {
  const [selectedDate, setSelectedDate] = useState("2025-11-04");
  const [clickedSession, setClickedSession] = useState(null);
  // Weekly daysOfWeek data
  const weekDays = [
    { day: "2", date: "2025-11-04" },
    { day: "3", date: "2025-11-05" },
    { day: "4", date: "2025-11-06" },
    { day: "5", date: "2025-11-07" },
    { day: "6", date: "2025-11-08" },
    { day: "7", date: "2025-11-09" },
    { day: "8", date: "2025-11-10" },
  ];

  const sessions = [
    {
      id: 1,
      date: "2025-11-04",
      startTime: "18:00",
      endTime: "19:30",
      status: "Chưa bắt đầu",
      mainInstructors: [
        { id: 1, name: "Nguyễn Văn A", roleInSession: 'coach', status: "Dạy" },
        { id: 2, name: "Trần Thị B", roleInSession: 'instructor', status: "Dạy" },
      ],
      substituteInstructors: [],
    },
    {
      id: 2,
      date: "2025-11-06",
      startTime: "18:00",
      endTime: "19:30",
      status: "Chưa bắt đầu",
      mainInstructors: [
        { id: 1, name: "Nguyễn Văn A", roleInSession: 'coach', status: "Không dạy" },
      ],
      substituteInstructors: [{ id: 3, name: "Võ Văn F", roleInSession: 'substituted_coach', status: "Dạy" }],
    },
    {
      id: 3,
      date: "2025-11-08",
      startTime: "18:00",
      endTime: "19:30",
      status: "Chưa bắt đầu",
      mainInstructors: [{ id: 2, name: "Trần Thị B", roleInSession: 'instructor', status: "Dạy" }],
      substituteInstructors: [],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => {
              setSelectedClass(null);
              setView("list");
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại danh sách lớp</span>
          </button>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {selectedClass.name}
          </h1>
          <div className="flex items-center gap-4 text-blue-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {selectedClass.daysOfWeek
                  .split("-")
                  .map((d) => getDay(d))
                  .join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {selectedClass.startTime} - {selectedClass.endTime}
              </span>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-900">
                Tuần 04/11 - 10/11/2025
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Weekly Grid */}
        <WeeklySessionsGrid
            selectedClass={selectedClass}
            sessions={sessions}
            weekDays={weekDays}
        />

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm Buổi Học Hàng Loạt
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Xuất Lịch Học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassScheduleView;