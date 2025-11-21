import { useState, useEffect } from "react";
import {
  ArrowLeft,
} from "lucide-react";
import Button from "../../../../components/Button";
import SessionOverviewPanel from "./SessionOverviewPanel";
import ConfigurationPanel from "./ConfigurationPanel";
import DayOfWeekFilter from "./DayOfWeekFilter";
import ConfirmationModal from "./RemoveTemplateConfirmationModal";
import TemplatesList from "./template_list/TemplateList";
import Header from "../../../../components/Header";

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
        sessionsUpdatedAt: "2025-11-17 14:30:00",
        latestSession: "2025-12-30",
      },
      {
        id: 2,
        name: "Lớp Võ Nâng Cao B2",
        daysOfWeek: "3-5-7",
        startTime: "19:00",
        endTime: "20:30",
        sessionsUpdatedAt: "2025-11-16 10:15:00",
        latestSession: "2025-12-28",
      },
    ],
  },
  {
    id: 2,
    name: "Cơ sở Quận 3",
    classes: [
      {
        id: 3,
        name: "Lớp Võ Thiếu Nhi C1",
        daysOfWeek: "2-4",
        startTime: "17:00",
        endTime: "18:00",
        sessionsUpdatedAt: "2025-11-15 09:00:00",
        latestSession: "2025-12-25",
      },
    ],
  },
  { id: 3, name: "Cơ sở Bình Thạnh", classes: [] },
];

// const defaultTemplate = {
//   dayOfWeek: day,
//   startTime: selectedClassData.startTime,
//   endTime: selectedClassData.endTime,
//   mainInstructors: [
//     {
//       id: 1,
//       name: "Nguyễn Văn A",
//       roleInSession: "coach",
//       status: "available",
//     },
//     {
//       id: 2,
//       name: "Trần Thị B",
//       roleInSession: "instructor",
//       status: "available",
//     },
//   ],
//   substituteInstructors: [
//     {
//       id: 3,
//       name: "Nguyễn Văn C",
//       roleInSession: "coach",
//       status: "available",
//     },
//     {
//       id: 4,
//       name: "Trần Thị D",
//       roleInSession: "instructor",
//       status: "available",
//     },
//   ],
//   students: [
//     { id: 1, name: "Võ sinh Lê Văn C", isRegular: true },
//     { id: 2, name: "Võ sinh Phạm Thị D", isRegular: true },
//     { id: 3, name: "Võ sinh Hoàng Văn E", isRegular: false },
//   ],
// };

// Main Component
const ClassSessionEdit = ({ setView }) => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedDays, setSelectedDays] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    day: null,
  });
  const maxDaysPeriod = 90;

  // Initialize templates when days are selected
  const initializeTemplates = () => {
    const selectedClassData = selectedClass;
    if (!selectedClassData) return;

    const newTemplates = selectedDays.map((day) => {
      const existingTemplate = templates.find((t) => t.dayOfWeek === day);
      if (existingTemplate) return existingTemplate;

      return {
        dayOfWeek: day,
        startTime: selectedClassData.startTime,
        endTime: selectedClassData.endTime,
        mainInstructors: [
          {
            id: 1,
            name: "Nguyễn Văn A",
            roleInSession: "coach",
            status: "available",
          },
          {
            id: 2,
            name: "Trần Thị B",
            roleInSession: "instructor",
            status: "available",
          },
        ],
        students: [
          { id: 1, name: "Võ sinh Lê Văn C", isRegular: true },
          { id: 2, name: "Võ sinh Phạm Thị D", isRegular: true },
          { id: 3, name: "Võ sinh Hoàng Văn E", isRegular: false },
        ],
      };
    });

    // Sort by day: Ascending
    newTemplates.sort((temp1, temp2) => temp1.dayOfWeek - temp2.dayOfWeek);

    setTemplates(newTemplates);
  };

  useEffect(initializeTemplates, [selectedDays, selectedClass]);

  const handleToggleDay = (day) => {
    setSelectedDays((prev) => [...prev, day]);
  };

  const handleRemoveDay = (day) => {
    setConfirmModal({ isOpen: true, day });
  };

  const confirmRemoveDay = () => {
    setSelectedDays((prev) => prev.filter((d) => d !== confirmModal.day));
    setTemplates((prev) =>
      prev.filter((t) => t.dayOfWeek !== confirmModal.day)
    );
    setConfirmModal({ isOpen: false, day: null });
  };
  console.log(templates);
  const toggleInstructorStatus = (dayOfWeek, instructorId) => { 
    
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => {
        if (template.dayOfWeek === dayOfWeek) {
          return {
            ...template,
            mainInstructors: template.mainInstructors.map((instructor) => {
              if (instructor.id === instructorId) {
                if (instructor.roleInSession !== "off") {
                  return {
                    ...instructor,
                    roleInSession: "off",
                  };
                }
                return {
                  ...instructor,
                  roleInSession: "assistant"
                };
              }
              return instructor;
            }),
          };
        }
        return template;
      })
    );
  };

  // Updated toggleInstructorRole function with proper shift head logic
  const toggleInstructorRole = (
    dayOfWeek,
    instructorId,
    isSettingShiftHead
  ) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => {
        if (template.dayOfWeek === dayOfWeek) {
          return {
            ...template,
            mainInstructors: template.mainInstructors.map((instructor) => {
              // If this is the instructor being clicked
              if (instructor.id === instructorId) {
                // If they are currently the shift head, remove the role
                if (isSettingShiftHead) {
                  return {
                    ...instructor,
                    // Revert to previous role (coach or instructor)
                    roleInSession: "assistant",
                  };
                }
                // Otherwise, set them as shift head
                return {
                  ...instructor,
                  roleInSession: "leader",
                };
              }

              // Remove shift head role from all other instructors
              if (
                instructor.roleInSession === "leader" &&
                !isSettingShiftHead
              ) {
                return {
                  ...instructor,
                  // Default back to coach when losing shift head role
                  roleInSession: "assistant",
                };
              }

              return instructor;
            }),
          };
        }
        return template;
      })
    );
  };

  const onAddMembers = (dayOfWeek, member, role) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => {
        if (template.dayOfWeek === dayOfWeek) {
          return {
            ...template,
            [role]: [...template[role], member]
          };
        }
        return template;
      })
    );
  }

  const onDeleteMembers = (dayOfWeek, memberId) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) => {
        if (template.dayOfWeek === dayOfWeek) {
          return {
            ...template,
            mainInstructors: template.mainInstructors.filter(
              (instructor) => instructor.id !== memberId
            ),
            students: template.students.filter(
              (student) => student.id !== memberId
            ),
          };
        }
        return template;
      })
    );
  }

  const handleTimeChange = (dayOfWeek, startTime, endTime) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.dayOfWeek === dayOfWeek
          ? { ...template, startTime, endTime }
          : template
      )
    );
  };

  const validateDateRange = () => {
    if (!dateRange.start || !dateRange.end) return true;

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays < 0 || diffDays > maxDaysPeriod;
  };

  const isCreateDisabled =
    validateDateRange() || !selectedClass || !dateRange.start || !dateRange.end;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          title={"Quản Lý Buổi Học"}
          description={"Thêm và quản lý các buổi học cho lớp"}
          backButton={
            <Button
              title={"Quay lại danh sách lớp"}
              icon={<ArrowLeft className="w-5 h-5" />}
              handleOnClick={() => setView("list")}
              background={false}
              font="font-medium"
            />
          }
        />
        <SessionOverviewPanel facilities={facilities} />
        <ConfigurationPanel
          facilities={facilities}
          selectedFacility={selectedFacility}
          setSelectedFacility={setSelectedFacility}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          dateRange={dateRange}
          setDateRange={setDateRange}
          maxDaysPeriod={maxDaysPeriod}
          isCreateDisabled={isCreateDisabled}
        />
        <DayOfWeekFilter
          selectedClass={selectedClass}
          selectedDays={selectedDays}
          onToggleDay={handleToggleDay}
          onRemoveDay={handleRemoveDay}
        />
        <TemplatesList
          templates={templates}
          onToggleStatus={toggleInstructorStatus}
          onToggleRole={toggleInstructorRole}
          onTimeChange={handleTimeChange}
          onDeleteMembers= {onDeleteMembers}
          onAddMembers={onAddMembers}
        />
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          dayOfWeek={confirmModal.day}
          onConfirm={confirmRemoveDay}
          onCancel={() => setConfirmModal({ isOpen: false, day: null })}
        />
      </div>
    </div>
  );
};

export default ClassSessionEdit;
