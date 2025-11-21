
const BriefScheduleCard = ({hoveredDay, setHoveredDay}) => {
    
    return (
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-white rounded-lg shadow-2xl border-4 border-blue-500 p-6"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-blue-200">
          <div>
            <h4 className="font-bold text-blue-900 text-xl">
              {weekDays.find((d) => d.date === hoveredDay)?.day}, {hoveredDay}
            </h4>
            <p className="text-sm text-blue-600 mt-1">
              Thông tin chi tiết các buổi học
            </p>
          </div>
          <button
            className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
            onClick={() => setHoveredDay(null)}
          >
            <X color="red" size={20} />
          </button>
        </div>

        {/* Sessions Detail */}
        <div
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 120px)" }}
        >
          {sessions[hoveredDay].map((session) => (
            <div
              key={session.id}
              className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50"
            >
              {/* Session Time and Status */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-blue-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-base font-semibold text-blue-900">
                    {session.time}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    session.status
                  )}`}
                >
                  {session.status}
                </span>
              </div>

              {/* Main Instructors */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  HLV/HDV Chính:
                </p>
                <div className="space-y-2">
                  {session.mainInstructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center justify-between bg-white rounded p-3"
                    >
                      <div className="flex items-center gap-2">
                        {instructor.status === "Dạy" ? (
                          <UserCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <UserX className="w-5 h-5 text-orange-600" />
                        )}
                        <span className="text-sm text-blue-900 font-medium">
                          {instructor.name}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getInstructorStatusColor(
                          instructor.status
                        )}`}
                      >
                        {instructor.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitute Instructors */}
              {session.substituteInstructors.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    HLV/HDV Dạy Thế:
                  </p>
                  <div className="space-y-2">
                    {session.substituteInstructors.map((instructor) => (
                      <div
                        key={instructor.id}
                        className="flex items-center gap-2 bg-green-50 rounded p-3"
                      >
                        <UserCheck className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-900 font-medium">
                          {instructor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}