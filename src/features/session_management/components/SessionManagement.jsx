import React, { useState } from 'react';
import { Calendar, Clock, Users, UserCheck, UserX, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, ArrowLeft } from 'lucide-react';

const ClassScheduleView = () => {
  const [selectedFacility, setSelectedFacility] = useState('1');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2025-11-04');
  const [hoveredDay, setHoveredDay] = useState(null);

  // Mock data
  const facilities = [
    { id: 1, name: 'Cơ sở Quận 1' },
    { id: 2, name: 'Cơ sở Quận 3' },
    { id: 3, name: 'Cơ sở Bình Thạnh' }
  ];

  const classes = [
    { 
      id: 1, 
      name: 'Lớp Võ Cơ Bản A1', 
      facilityId: 1, 
      schedule: ['Thứ 2', 'Thứ 4', 'Thứ 6'], 
      startTime: '18:00', 
      endTime: '19:30',
      latestSession: '2025-12-20'
    },
    { 
      id: 2, 
      name: 'Lớp Võ Nâng Cao B2', 
      facilityId: 1, 
      schedule: ['Thứ 3', 'Thứ 5', 'Thứ 7'], 
      startTime: '19:00', 
      endTime: '20:30',
      latestSession: '2025-12-15'
    },
    { 
      id: 3, 
      name: 'Lớp Võ Thiếu Nhi C1', 
      facilityId: 1, 
      schedule: ['Thứ 2', 'Thứ 4', 'Thứ 6'], 
      startTime: '16:00', 
      endTime: '17:00',
      latestSession: '2025-11-30'
    }
  ];

  // Weekly schedule data
  const weekDays = [
    { day: 'Thứ 2', date: '2025-11-04' },
    { day: 'Thứ 3', date: '2025-11-05' },
    { day: 'Thứ 4', date: '2025-11-06' },
    { day: 'Thứ 5', date: '2025-11-07' },
    { day: 'Thứ 6', date: '2025-11-08' },
    { day: 'Thứ 7', date: '2025-11-09' },
    { day: 'CN', date: '2025-11-10' }
  ];

  const sessions = {
    '2025-11-04': [
      {
        id: 1,
        time: '18:00 - 19:30',
        status: 'Chưa bắt đầu',
        mainInstructors: [
          { id: 1, name: 'HLV Nguyễn Văn A', status: 'Dạy' },
          { id: 2, name: 'HDV Trần Thị B', status: 'Dạy' }
        ],
        substituteInstructors: []
      }
    ],
    '2025-11-06': [
      {
        id: 2,
        time: '18:00 - 19:30',
        status: 'Chưa bắt đầu',
        mainInstructors: [
          { id: 1, name: 'HLV Nguyễn Văn A', status: 'Không dạy' }
        ],
        substituteInstructors: [
          { id: 3, name: 'HLV Võ Văn F', status: 'Dạy' }
        ]
      }
    ],
    '2025-11-08': [
      {
        id: 3,
        time: '18:00 - 19:30',
        status: 'Chưa bắt đầu',
        mainInstructors: [
          { id: 2, name: 'HDV Trần Thị B', status: 'Dạy' }
        ],
        substituteInstructors: []
      }
    ]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Chưa bắt đầu': return 'bg-blue-100 text-blue-700';
      case 'Đang diễn ra': return 'bg-green-100 text-green-700';
      case 'Đã kết thúc': return 'bg-gray-100 text-gray-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getInstructorStatusColor = (status) => {
    return status === 'Dạy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700';
  };

  const filteredClasses = classes.filter(c => c.facilityId === parseInt(selectedFacility));

  // Classes List View
  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Quản Lý Buổi Học</h1>
            <p className="text-blue-600">Xem thời khóa biểu và quản lý buổi học của các lớp</p>
          </div>

          {/* Facility Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Lọc Theo Cơ Sở
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>{facility.name}</option>
              ))}
            </select>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-400"
              >
                <h3 className="text-xl font-bold text-blue-900 mb-4">{cls.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngày học</p>
                      <p className="text-blue-900 font-medium">{cls.schedule.join(', ')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Giờ học</p>
                      <p className="text-blue-900 font-medium">{cls.startTime} - {cls.endTime}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Buổi học mới nhất</p>
                    <p className="text-blue-900 font-semibold">{cls.latestSession}</p>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Xem Thời Khóa Biểu
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Weekly Schedule View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button 
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại danh sách lớp</span>
          </button>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{selectedClass.name}</h1>
          <div className="flex items-center gap-4 text-blue-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{selectedClass.schedule.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{selectedClass.startTime} - {selectedClass.endTime}</span>
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
              <h2 className="text-xl font-bold text-blue-900">Tuần 04/11 - 10/11/2025</h2>
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
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {weekDays.map((dayInfo) => {
              const daySessions = sessions[dayInfo.date] || [];
              const isScheduledDay = selectedClass.schedule.includes(dayInfo.day);
              const isHovered = hoveredDay === dayInfo.date;
              
              return (
                <div 
                  key={dayInfo.date} 
                  className="bg-white rounded-lg shadow-md overflow-hidden relative"
                  onMouseEnter={() => setHoveredDay(dayInfo.date)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Day Header */}
                  <div className={`p-4 ${isScheduledDay ? 'bg-blue-600' : 'bg-gray-400'}`}>
                    <h3 className="text-white font-bold text-center">{dayInfo.day}</h3>
                    <p className="text-white text-sm text-center opacity-90">{dayInfo.date}</p>
                  </div>

                  {/* Full View */}
                  <div className="p-4 space-y-3 min-h-[200px]">
                    {daySessions.length > 0 ? (
                      daySessions.map((session) => (
                        <div key={session.id} className="border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 transition">
                          {/* Session Time and Status */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-blue-900">{session.time}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>

                          {/* Main Instructors */}
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">HLV/HDV Chính:</p>
                            <div className="space-y-1">
                              {session.mainInstructors.map((instructor) => (
                                <div key={instructor.id} className="flex items-center justify-between text-xs">
                                  <span className="text-blue-900 truncate flex-1">{instructor.name}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ml-1 ${getInstructorStatusColor(instructor.status)}`}>
                                    {instructor.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Substitute Instructors */}
                          {session.substituteInstructors.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 mb-1">HLV/HDV Dạy Thế:</p>
                              <div className="space-y-1">
                                {session.substituteInstructors.map((instructor) => (
                                  <div key={instructor.id} className="flex items-center justify-between text-xs">
                                    <span className="text-green-900 truncate">{instructor.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-1 mt-3 pt-2 border-t border-blue-100">
                            <button className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1">
                              <Edit2 className="w-3 h-3" />
                              Chi tiết
                            </button>
                            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : isScheduledDay ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm mb-3">Chưa có buổi học</p>
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1 mx-auto">
                          <Plus className="w-4 h-4" />
                          Thêm buổi học
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Không có lịch học</p>
                      </div>
                    )}

                    {/* Add Session Button for days with existing sessions */}
                    {daySessions.length > 0 && isScheduledDay && (
                      <button className="w-full py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" />
                        Thêm buổi học
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hover Detail Panel - Positioned absolutely outside grid */}
          {hoveredDay && sessions[hoveredDay] && sessions[hoveredDay].length > 0 && (
            <div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 bg-white rounded-lg shadow-2xl border-4 border-blue-500 p-6"
              style={{ maxHeight: '80vh' }}
            >
              {/* Header */}
              <div className="mb-4 pb-3 border-b-2 border-blue-200">
                <h4 className="font-bold text-blue-900 text-xl">
                  {weekDays.find(d => d.date === hoveredDay)?.day}, {hoveredDay}
                </h4>
                <p className="text-sm text-blue-600 mt-1">Thông tin chi tiết các buổi học</p>
              </div>

              {/* Sessions Detail */}
              <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                {sessions[hoveredDay].map((session) => (
                  <div key={session.id} className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                    {/* Session Time and Status */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-blue-200">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-base font-semibold text-blue-900">{session.time}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
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
                          <div key={instructor.id} className="flex items-center justify-between bg-white rounded p-3">
                            <div className="flex items-center gap-2">
                              {instructor.status === 'Dạy' ? (
                                <UserCheck className="w-5 h-5 text-green-600" />
                              ) : (
                                <UserX className="w-5 h-5 text-orange-600" />
                              )}
                              <span className="text-sm text-blue-900 font-medium">{instructor.name}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getInstructorStatusColor(instructor.status)}`}>
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
                            <div key={instructor.id} className="flex items-center gap-2 bg-green-50 rounded p-3">
                              <UserCheck className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-green-900 font-medium">{instructor.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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