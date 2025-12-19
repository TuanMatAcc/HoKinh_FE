import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Button from "../../../../components/Button";
import SessionOverviewPanel from "./SessionOverviewPanel";
import ConfigurationPanel from "./ConfigurationPanel";
import DayOfWeekFilter from "./DayOfWeekFilter";
import ConfirmationModal from "./RemoveTemplateConfirmationModal";
import TemplatesList from "./template_list/TemplateList";
import Header from "../../../../components/Header";
import AnnouncementUI from "../../../../components/Announcement";
import { ThreeDotLoader } from "../../../../components/ActionFallback";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";
import { sessionService } from "../../../../services/session_api";
import { getDayOfWeek } from "../../../../utils/formatDateAndTimeType";
import { useActiveClassMembers } from "../../../../hooks/useClassMembers";
import { useQueryClient } from "@tanstack/react-query";
import getDay from "../../../../utils/getVietnameseDay";

// Main Component
const ClassSessionEdit = ({ setView, facilities }) => {
  const today = new Date().toISOString().slice(0, 10);
  const queryClient = useQueryClient();
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showError, setShowError] = useState(false);
  const errorMessage = useRef("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const progressStatement = useRef("");
  const [selectedClass, setSelectedClass] = useState(null);
  const { data: users } = useActiveClassMembers({ classId: selectedClass?.id });
  const [dateRange, setDateRange] = useState({ start: today, end: today });
  const [selectedDays, setSelectedDays] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    day: null,
  });
  const maxDaysPeriod = 1000;

  // Initialize templates when days are selected
  const initializeTemplates = () => {
    const selectedClassData = selectedClass;
    if (!selectedClassData) return;

    const newTemplates = selectedDays.map((day) => {
      const existingTemplate = templates.find((t) => t.dayOfWeek === day);
      if (existingTemplate) return existingTemplate;

      return {
        dayOfWeek: day,
        startTime: selectedClassData.startHour,
        endTime: selectedClassData.endHour,
        mainInstructors: Object.entries(users)
          .filter(([key]) => key !== "student")
          .map(([_, value]) => ({
            id: value[0].id,
            name: value[0].name,
            roleInSession: "assistant",
          })),
        students: users["student"]
          ? users["student"].map((stu) => ({
              id: stu.id,
              name: stu.name,
              roleInSession: "student",
              isRegular: true,
            }))
          : [],
      };
    });

    // Sort by day: Ascending
    newTemplates.sort((temp1, temp2) => temp1.dayOfWeek - temp2.dayOfWeek);
    console.log(newTemplates);
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
    console.log(member);
    const exist = templates
      .find((template) => dayOfWeek === template.dayOfWeek)
      [role].find((mem) => mem.id === member.id);
    if (!exist) {
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) => {
          if (template.dayOfWeek === dayOfWeek) {
            return {
              ...template,
              [role]: [
                ...template[role],
                role === "mainInstructors"
                  ? {
                      id: member.id,
                      name: member.name,
                      roleInSession: "assistant",
                    }
                  : {
                      id: member.id,
                      name: member.name,
                      roleInSession: "student",
                      isRegular: member.classId === selectedClass.id,
                    },
              ],
            };
          }
          return template;
        })
      );
    } else {
      throw new Error(
        "Người dùng " + member.name + " đã được thêm vào template"
      );
    }
  };

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
  };

  const handleTimeChange = (dayOfWeek, startTime, endTime) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.dayOfWeek === dayOfWeek
          ? { ...template, startTime: startTime, endTime: endTime }
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

  const prepareTemplateData = () => {
    return templates.map((template) => ({
      ...template,
      dayOfWeek: parseInt(template.dayOfWeek) - 1,
      users: [...template.mainInstructors, ...template.students],
    }));
  };

  const validateTemplates = () => {
    const templatesWithNoLeader = templates
      .filter(
        (temp) =>
          !temp.mainInstructors.find(
            (instructor) => instructor.roleInSession === "leader"
          )
      )
      .map((temp) => parseInt(temp.dayOfWeek, 10));
    console.log(templatesWithNoLeader);
    if (templatesWithNoLeader.length !== 0) return "Template " + templatesWithNoLeader.map(tempDay => getDay(tempDay)).join(", ") + " chưa có ca trưởng";
    return "";
  };

  const handleCreateTemplate = async () => {
    const err = validateTemplates();
    if(!err) {
      setShowConfirmDialog(false);
      if (templates.length === 0) {
        setShowError(true);
        errorMessage.current =
          "Bạn chưa chọn template nào để tiến hành tạo buổi học";
        return;
      }
      setInProgress(true);
      progressStatement.current = "Đang tiến hành tạo buổi học...";
      // API Call Creating Sessions ***TODO***
      try {
        const templateData = prepareTemplateData();
        console.log(templateData);
        await sessionService.createSessions(
          selectedClass.id,
          dateRange.start,
          dateRange.end,
          templateData
        );
        setInProgress(false);
        queryClient.invalidateQueries({
          queryKey: ["sessions"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["session"],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["facilities", "management"],
          exact: true,
        });
      } catch (error) {
        if (error?.response) {
          errorMessage.current = error.response.data;
          setShowError(true);
        } else {
          errorMessage.current = error.response;
          setShowError(true);
        }
        setInProgress(false);
      }
    }
    else {
      setShowError(true);
      setShowConfirmDialog(false);
      errorMessage.current = err;
    }
  };

  return (
    <>
      {showError && (
        <AnnouncementUI
          message={errorMessage.current}
          setVisible={setShowError}
        />
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          title={
            <p>
              Từ{" "}
              <span className=" inline-block text-xl text-blue-700">
                {getDayOfWeek(dateRange.start) +
                  " (" +
                  dateRange.start.split("-").join("/") +
                  ")"}
              </span>{" "}
              đến{" "}
              <span className=" inline-block text-xl text-blue-700">
                {getDayOfWeek(dateRange.end) +
                  " (" +
                  dateRange.end.split("-").join("/") +
                  ")"}
              </span>{" "}
            </p>
          }
          askDetail={
            <span>
              Bạn có chắc chắn muốn tạo các buổi học trong khoảng thời gian trên
              cho lớp <strong>{selectedClass.name}</strong> không ?
            </span>
          }
          handleCancel={() => setShowConfirmDialog(false)}
          handleConfirm={handleCreateTemplate}
        />
      )}
      {inProgress && (
        <ThreeDotLoader
          size="lg"
          color="blue"
          message={progressStatement.current}
        />
      )}
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Header
            title={"Quản Lý Buổi Học"}
            description={<p className="text-blue-600">Thêm và quản lý các buổi học cho lớp</p>}
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
            setSelectedDays={setSelectedDays}
            facilities={facilities}
            setTemplates={setTemplates}
            selectedFacility={selectedFacility}
            setSelectedFacility={setSelectedFacility}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            dateRange={dateRange}
            setDateRange={setDateRange}
            maxDaysPeriod={maxDaysPeriod}
            isCreateDisabled={isCreateDisabled}
            handleCreateTemplate={() => setShowConfirmDialog(true)}
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
            onDeleteMembers={onDeleteMembers}
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
    </>
  );
};

export default ClassSessionEdit;
