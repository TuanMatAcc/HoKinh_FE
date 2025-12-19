import { useState } from "react";
import { getInstructorSessionStatus } from "../../../utils/getStatusSession";
import {
  MapPin,
  Clock,
  Calendar,
  Video,
  FileText,
  User,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { getStudyHour } from "../../../utils/formatDateAndTimeType";
import formatDate from "../../../utils/formatDate";

// Utility Functions
const convertDateInputToVN = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// SessionHeader Component
const SessionHeader = ({ className, role, session, onBack }) => {
  const isLeader = role === "leader";
  const showStatus = getInstructorSessionStatus(
    session.date,
    session.startTime,
    session.endTime,
    session.status,
    session.report,
    session.videoLink,
    session.status
  );

  return (
    <div className="bg-blue-500 text-white p-4 sm:p-6 rounded-t-lg">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-3 sm:mb-4 text-white hover:text-blue-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base">Quay lại</span>
        </button>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 wrap-break-word">
            {className}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {isLeader && (
              <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-purple-400 whitespace-nowrap">
                Trưởng ca
              </span>
            )}
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${showStatus.color}`}
            >
              {showStatus.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// SessionInfo Component
const SessionInfo = ({
  facilityName,
  facilityAddress,
  facilityMapsLink,
  date,
  startTime,
  endTime,
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
        Thông tin buổi học
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600">Ngày học</p>
            <p className="font-semibold text-sm sm:text-base text-gray-900 wrap-break-word">
              {convertDateInputToVN(date)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 sm:gap-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600">Thời gian</p>
            <p className="font-semibold text-sm sm:text-base text-gray-900">
              {getStudyHour(startTime)} - {getStudyHour(endTime)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 sm:gap-3">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600">Cơ sở</p>
            <p className="font-semibold text-sm sm:text-base text-gray-900 wrap-break-word">
              {facilityName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 sm:gap-3">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-gray-600">Địa chỉ</p>
            {facilityMapsLink ? (
              <a
                href={facilityMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm sm:text-base text-blue-600 hover:text-blue-800 hover:underline wrap-break-word"
              >
                {facilityAddress}
              </a>
            ) : (
              <p className="font-semibold text-sm sm:text-base text-gray-900 wrap-break-word">
                {facilityAddress}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// AttendanceNotice Component
const AttendanceNotice = ({ startTime, attended, checkinTime }) => {
  const isLateCheckin = (checkinTime, startTime) => {
    if (!checkinTime || !startTime) return false;
    const checkinDate = new Date(checkinTime);
    const checkinMinutes =
      checkinDate.getHours() * 60 + checkinDate.getMinutes();
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    return checkinMinutes > startMinutes;
  };

  if (!attended) {
    return (
      <div className="flex items-start gap-2 p-3 sm:p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
        <span className="text-xs sm:text-sm text-amber-800 font-medium">
          Bạn chưa check in. Vui lòng check in để nhập thông tin buổi học.
        </span>
      </div>
    );
  }

  if (checkinTime) {
    const isLate = isLateCheckin(checkinTime, startTime);

    if (isLate) {
      return (
        <div className="flex items-start gap-2 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm text-red-800 font-medium">
            Bạn đã check in muộn vào lúc{" "}
            <strong className="wrap-break-word">
              {formatDate({ dateString: checkinTime, region: "vi-VN" })}
            </strong>
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-start gap-2 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm text-green-800 font-medium">
            Bạn đã check in đúng giờ vào lúc{" "}
            <strong className="wrap-break-word">
              {formatDate({ dateString: checkinTime, region: "vi-VN" })}
            </strong>
          </span>
        </div>
      );
    }
  } else {
    return (
      <div className="flex items-start gap-2 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded">
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0 mt-0.5" />
        <span className="text-xs sm:text-sm text-green-800 font-medium">
          Bạn đã check in buổi học này
        </span>
      </div>
    );
  }
};

// EditableField Component
const EditableField = ({
  label,
  value,
  onChange,
  icon: Icon,
  disabled,
  multiline = false,
  placeholder,
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
        {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />}
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white"
          }`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white"
          }`}
        />
      )}
    </div>
  );
};

// SessionContent Component
const SessionContent = ({
  topic,
  report,
  videoLink,
  attended,
  onTopicChange,
  onReportChange,
  onVideoLinkChange,
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
        Nội dung buổi học
      </h2>

      <EditableField
        label="Chủ đề"
        value={topic ? topic : ""}
        onChange={onTopicChange}
        icon={FileText}
        disabled={!attended}
        placeholder="Nhập chủ đề buổi học..."
      />

      <EditableField
        label="Báo cáo"
        value={report ? report : ""}
        onChange={onReportChange}
        icon={FileText}
        disabled={!attended}
        multiline
        placeholder="Nhập báo cáo buổi học..."
      />

      <EditableField
        label="Link video"
        value={videoLink ? videoLink : ""}
        onChange={onVideoLinkChange}
        icon={Video}
        disabled={!attended}
        placeholder="Nhập link video buổi học..."
      />
    </div>
  );
};

// StudentReviewModal Component
const StudentReviewModal = ({ student, onClose, onSave }) => {
  const [review, setReview] = useState(student.review || "");

  const handleSave = () => {
    onSave(student.studentId, review);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Nhận xét võ sinh
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">Võ sinh</p>
            <p className="font-semibold text-sm sm:text-base text-gray-900 wrap-break-word">
              {student.studentName}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Mã: {student.studentId}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">
              Nhận xét
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              placeholder="Nhập nhận xét về võ sinh..."
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Lưu nhận xét
          </button>
        </div>
      </div>
    </div>
  );
};

// StudentRow Component
const StudentRow = ({
  student,
  attended,
  onAttendanceToggle,
  onReviewClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-3">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm sm:text-base text-gray-900 wrap-break-word">
            {student.studentName}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 break-all">
            Mã: {student.studentId}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <button
          onClick={() => onAttendanceToggle(student.studentId)}
          disabled={!attended}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold transition whitespace-nowrap ${
            student.attended
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-red-600 text-white hover:bg-red-700"
          } ${!attended ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {student.attended ? "Có mặt" : "Vắng"}
        </button>

        <button
          onClick={() => onReviewClick(student)}
          disabled={!attended}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap ${
            !attended ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Nhận xét
        </button>
      </div>
    </div>
  );
};

// StudentsSection Component
const StudentsSection = ({
  students,
  attended,
  onAttendanceToggle,
  onAllPresentToggle,
  onReviewSave,
}) => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleReviewClick = (student) => {
    setSelectedStudent(student);
  };

  const handleReviewSave = (studentId, review) => {
    onReviewSave(studentId, review);
  };

  return (
    <div className="bg-white p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Danh sách võ sinh ({students.length})
        </h2>
        <button
          onClick={onAllPresentToggle}
          disabled={!attended}
          className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium whitespace-nowrap ${
            !attended ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Tất cả có mặt
        </button>
      </div>

      {students.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {students.map((student) => (
            <StudentRow
              key={student.studentId}
              student={student}
              attended={attended}
              onAttendanceToggle={onAttendanceToggle}
              onReviewClick={handleReviewClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-8 text-gray-400">
          <User className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm sm:text-base">Chưa có võ sinh nào</p>
        </div>
      )}

      {selectedStudent && (
        <StudentReviewModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={handleReviewSave}
        />
      )}
    </div>
  );
};

// AttendanceSummary Component
const AttendanceSummary = ({ students }) => {
  const totalStudents = students.length;
  const presentStudents = students.filter((s) => s.attended).length;
  const absentStudents = totalStudents - presentStudents;

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Tổng số</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {totalStudents}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Có mặt</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {presentStudents}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Vắng</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600">
            {absentStudents}
          </p>
        </div>
      </div>
    </div>
  );
};

// SaveButton Component
const SaveButton = ({ onSave, disabled, students }) => {
  return (
    <div className="sticky bottom-0 bg-white border-t p-4 sm:p-6 space-y-3 sm:space-y-4">
      <AttendanceSummary students={students} />
      <button
        onClick={onSave}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
        Lưu thông tin
      </button>
    </div>
  );
};

// Main SessionDetailPage Component
export const SessionDetailPage = ({ session, setSession, onSave, onBack }) => {
  const handleTopicChange = (value) => {
    setSession((prev) => ({ ...prev, topic: value }));
  };

  const handleReportChange = (value) => {
    setSession((prev) => ({ ...prev, report: value }));
  };

  const handleVideoLinkChange = (value) => {
    setSession((prev) => ({ ...prev, videoLink: value }));
  };

  const handleAttendanceToggle = (studentId) => {
    setSession((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.studentId === studentId ? { ...s, attended: !s.attended } : s
      ),
    }));
  };

  const handleAllPresentToggle = () => {
    setSession((prev) => ({
      ...prev,
      students: prev.students.map((s) => ({
        ...s,
        attended: true,
      })),
    }));
  };

  const handleReviewSave = (studentId, review) => {
    setSession((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.studentId === studentId ? { ...s, review } : s
      ),
    }));
  };

  const handleSave = () => {
    onSave(session);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-4">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <SessionHeader
            className={session.className}
            role={session.role}
            session={session}
            onBack={onBack}
          />

          <div className="divide-y">
            <SessionInfo
              facilityName={session.facilityName}
              facilityAddress={session.facilityAddress}
              facilityMapsLink={session.facilityMapsLink}
              date={session.date}
              startTime={session.startTime}
              endTime={session.endTime}
            />

            <div className="p-4 sm:p-6">
              <AttendanceNotice
                startTime={session.startTime}
                attended={session.attended}
                checkinTime={session.checkinTime}
              />
            </div>

            <SessionContent
              topic={session.topic}
              report={session.report}
              videoLink={session.videoLink}
              attended={session.attended}
              onTopicChange={handleTopicChange}
              onReportChange={handleReportChange}
              onVideoLinkChange={handleVideoLinkChange}
            />

            <StudentsSection
              students={session.students ? session.students : []}
              attended={session.attended}
              onAttendanceToggle={handleAttendanceToggle}
              onAllPresentToggle={handleAllPresentToggle}
              onReviewSave={handleReviewSave}
            />
          </div>

          <SaveButton
            onSave={handleSave}
            disabled={!session.attended}
            students={session.students ? session.students : []}
          />
        </div>
      </div>
    </div>
  );
};
