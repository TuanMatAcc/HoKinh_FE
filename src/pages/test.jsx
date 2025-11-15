import React, { useState } from 'react';
import { Calendar, Clock, Users, UserCheck, UserX, Plus, X, Edit2, Trash2, Save } from 'lucide-react';

const ClassSessionManager = () => {
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showSessionDetail, setShowSessionDetail] = useState(false);
  const [sessionsData, setSessionsData] = useState([]);

  // Mock data
  const facilities = [
    { id: 1, name: 'Cơ sở Quận 1' },
    { id: 2, name: 'Cơ sở Quận 3' },
    { id: 3, name: 'Cơ sở Bình Thạnh' }
  ];

  const classes = [
    { id: 1, name: 'Lớp Võ Cơ Bản A1', facilityId: 1, schedule: ['Thứ 2', 'Thứ 4', 'Thứ 6'], startTime: '18:00', endTime: '19:30' },
    { id: 2, name: 'Lớp Võ Nâng Cao B2', facilityId: 1, schedule: ['Thứ 3', 'Thứ 5', 'Thứ 7'], startTime: '19:00', endTime: '20:30' }
  ];

  const sessions = [
    {
      id: 1,
      date: '2025-11-04',
      dayOfWeek: 'Thứ 2',
      startTime: '18:00',
      endTime: '19:30',
      status: 'Chưa bắt đầu',
      mainInstructors: [
        { id: 1, name: 'HLV Nguyễn Văn A', type: 'HLV', status: 'Dạy' },
        { id: 2, name: 'HDV Trần Thị B', type: 'HDV', status: 'Dạy' }
      ],
      substituteInstructors: [],
      students: [
        { id: 1, name: 'Võ sinh Lê Văn C', isRegular: true },
        { id: 2, name: 'Võ sinh Phạm Thị D', isRegular: true },
        { id: 3, name: 'Võ sinh Hoàng Văn E', isRegular: false }
      ]
    },
    {
      id: 2,
      date: '2025-11-06',
      dayOfWeek: 'Thứ 4',
      startTime: '18:00',
      endTime: '19:30',
      status: 'Chưa bắt đầu',
      mainInstructors: [
        { id: 1, name: 'HLV Nguyễn Văn A', type: 'HLV', status: 'Không dạy' }
      ],
      substituteInstructors: [
        { id: 3, name: 'HLV Võ Văn F', type: 'HLV', status: 'Dạy' }
      ],
      students: [
        { id: 1, name: 'Võ sinh Lê Văn C', isRegular: true },
        { id: 2, name: 'Võ sinh Phạm Thị D', isRegular: true }
      ]
    }
  ];

  // Initialize sessionsData if empty
  React.useEffect(() => {
    if (sessionsData.length === 0) {
      setSessionsData(sessions);
    }
  }, []);

  const toggleInstructorStatus = (sessionId, instructorId) => {
    setSessionsData(prevSessions => 
      prevSessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            mainInstructors: session.mainInstructors.map(instructor => {
              if (instructor.id === instructorId) {
                return {
                  ...instructor,
                  status: instructor.status === 'Dạy' ? 'Không dạy' : 'Dạy'
                };
              }
              return instructor;
            })
          };
        }
        return session;
      })
    );
  };

  const selectedClassData = classes.find(c => c.id === parseInt(selectedClass));

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

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Quản Lý Buổi Học</h1>
          <p className="text-blue-600">Thêm và quản lý các buổi học cho lớp</p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Cấu Hình Buổi Học</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facility Selection */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Chọn Cơ Sở
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => {
                  setSelectedFacility(e.target.value);
                  setSelectedClass('');
                }}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">-- Chọn cơ sở --</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Chọn Lớp
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={!selectedFacility}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- Chọn lớp --</option>
                {classes
                  .filter(c => c.facilityId === parseInt(selectedFacility))
                  .map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Class Schedule Display */}
          {selectedClassData && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Lịch Học Của Lớp</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">{selectedClassData.schedule.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">{selectedClassData.startTime} - {selectedClassData.endTime}</span>
                </div>
              </div>
            </div>
          )}

          <button className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            Tạo Các Buổi Học
          </button>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-900">Danh Sách Buổi Học</h2>
            <span className="text-sm text-blue-600">Tổng: {sessions.length} buổi</span>
          </div>

          <div className="space-y-4">
            {sessionsData.map((session) => (
              <div key={session.id} className="border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition">
                {/* Session Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">{session.dayOfWeek}, {session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{session.startTime} - {session.endTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                    <button 
                      onClick={() => setShowSessionDetail(!showSessionDetail)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instructors Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  {/* Main Instructors */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-blue-900">HLV/HDV Chính</h4>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {session.mainInstructors.map((instructor) => (
                        <div key={instructor.id} className="flex items-center justify-between bg-white rounded p-2">
                          <div className="flex items-center gap-2">
                            {instructor.status === 'Dạy' ? (
                              <UserCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <UserX className="w-4 h-4 text-orange-600" />
                            )}
                            <span className="text-sm text-blue-900">{instructor.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => toggleInstructorStatus(session.id, instructor.id)}
                              className={`px-2 py-0.5 rounded text-xs font-medium transition hover:opacity-80 ${getInstructorStatusColor(instructor.status)}`}
                            >
                              {instructor.status}
                            </button>
                            <button className="text-blue-600 hover:text-blue-700 p-1">
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button className="text-red-600 hover:text-red-700 p-1">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Substitute Instructors */}
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-green-900">HLV/HDV Dạy Thế</h4>
                      <button className="text-green-600 hover:text-green-700">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {session.substituteInstructors.length > 0 ? (
                      <div className="space-y-2">
                        {session.substituteInstructors.map((instructor) => (
                          <div key={instructor.id} className="flex items-center justify-between bg-white rounded p-2">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-900">{instructor.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button className="text-green-600 hover:text-green-700 p-1">
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button className="text-red-600 hover:text-red-700 p-1">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2">Chưa có người dạy thế</p>
                    )}
                  </div>
                </div>

                {/* Students Section */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Võ Sinh ({session.students.length})
                    </h4>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Array.from({ length: 10 }).flatMap((_, i) =>
  session.students.map((student) => (
    <div
      key={`${student.id}-${i}`}
      className="flex items-center justify-between bg-white rounded p-2"
    >
      <span className="text-sm text-gray-900">{student.name}</span>
      {!student.isRegular && (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
          Trái buổi
        </span>
      )}
    </div>
  ))
)}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSessionManager;