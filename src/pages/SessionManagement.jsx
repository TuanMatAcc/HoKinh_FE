import { useState } from "react";
import {
  Plus,
} from "lucide-react";
import Button from "../components/Button";
import ClassSessionEdit from "../features/session_management/components/session_edit/ClassSessionEdit";
import Header from "../components/Header";
import ClassesGrid from "../features/session_management/components/schedule/ClassesGrid";
import ClassScheduleView from "../features/session_management/components/schedule/ClassScheduleView";
import { useFacility } from "../hooks/useFacilityData";

const SessionManagement = () => {
  const [view, setView] = useState("list");
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  console.log(selectedFacility);

  const {data: facilities} = useFacility();

  const filteredClasses = selectedFacility ? selectedFacility.classes : [];

  const handleFacilityChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setSelectedFacility(null);
      return;
    }

    const id = Number(value);
    setSelectedFacility(facilities?.data.find((fac) => fac.id === id));
  };

  // Classes List View
  if (view === "list") {
    return (
      <div className="min-h-screen p-6">
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
                value= {selectedFacility ? selectedFacility.id : ""}
                onChange={handleFacilityChange}
                className="w-full md:w-64 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Chọn cơ sở</option>
                {facilities?.data.map((facility) => (
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

  return <ClassSessionEdit setView={setView} facilities={facilities?.data}/>;
};

export default SessionManagement;
