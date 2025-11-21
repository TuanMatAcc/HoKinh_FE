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
import Button from "../components/Button";
import ClassSessionEdit from "../features/session_management/components/session_edit/ClassSessionEdit";
import Header from "../components/Header";
import ClassesGrid from "../features/session_management/components/schedule/ClassesGrid";
import ClassScheduleView from "../features/session_management/components/schedule/ClassScheduleView";

const SessionManagement = () => {
  const [view, setView] = useState("list");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  
  const [hoveredDay, setHoveredDay] = useState(null);

  // Mock data
  const facilities = [
    {
      id: 1,
      name: "Cơ sở Quận 1",
      classes: [
        {
          id: 1,
          name: "Lớp Võ Cơ Bản A1",
          daysOfWeek: "2-4-6",
          startTime: "18:00",
          endTime: "19:30",
          latestSession: "2025-12-20",
        },
        {
          id: 2,
          name: "Lớp Võ Nâng Cao B2",
          daysOfWeek: "3-5-7",
          startTime: "19:00",
          endTime: "20:30",
          latestSession: "2025-12-15",
        },
        {
          id: 3,
          name: "Lớp Võ Thiếu Nhi C1",
          daysOfWeek: "2-4-6",
          startTime: "16:00",
          endTime: "17:00",
          latestSession: "2025-11-30",
        },
      ],
    },
    { id: 2, name: "Cơ sở Quận 3", classes: [] },
    { id: 3, name: "Cơ sở Bình Thạnh", classes: [] },
  ];

  const classes = [
    {
      id: 1,
      name: "Lớp Võ Cơ Bản A1",
      facilityId: 1,
      daysOfWeek: "2-4-6",
      startTime: "18:00",
      endTime: "19:30",
      latestSession: "2025-12-20",
    },
    {
      id: 2,
      name: "Lớp Võ Nâng Cao B2",
      facilityId: 1,
      daysOfWeek: "3-5-7",
      startTime: "19:00",
      endTime: "20:30",
      latestSession: "2025-12-15",
    },
    {
      id: 3,
      name: "Lớp Võ Thiếu Nhi C1",
      facilityId: 1,
      daysOfWeek: "2-4-6",
      startTime: "16:00",
      endTime: "17:00",
      latestSession: "2025-11-30",
    },
  ];

  const filteredClasses = selectedFacility ? selectedFacility.classes : [];

  // Classes List View
  if (view === "list") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header
            title={"Quản Lý Buổi Học"}
            description={"Thêm và quản lý các buổi học cho lớp"}
          />

          {/* Facility Filter */}
          <div className="flex bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Lọc Theo Cơ Sở
              </label>
              <select
                defaultValue={""}
                onChange={(e) => setSelectedFacility(facilities.find(
                  fac => fac.id === parseInt(e.target.value)
                ))}
                className="w-full md:w-64 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Chọn cơ sở</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                title={"Tạo buổi học"}
                handleOnClick={() => setView("edit")}
                icon={<Plus size={20} />}
              />
            </div>
          </div>

          {/* Classes Grid */}
          <ClassesGrid
            setSelectedClass={setSelectedClass}
            setView={setView}
            filteredClasses={filteredClasses}
          />
        </div>
      </div>
    );
  }

  // Weekly daysOfWeek View

  if (view === "schedule") {
    return <ClassScheduleView
      setSelectedClass={setSelectedClass}
      setView={setView}
      selectedClass={selectedClass}
    />;
  }

  return <ClassSessionEdit setView={setView} />;
};

export default SessionManagement;
