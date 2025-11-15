import { useState } from 'react';
import { Menu, X, Home, MapPin, Users, LogOut } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('website');

  const [user] = useState({
    name: 'Nguyễn Văn A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });

  const menuItems = [
    { id: 'website', icon: Home, label: 'Quản Lý Website', path: 'website' },
    { id: 'branches', icon: MapPin, label: 'Chi Nhánh', path: 'co_so' },
    { id: 'members', icon: Users, label: 'Thành Viên', path: 'nguoi_dung' }
  ];

  return (
    <div className="flex h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-blue-900 via-blue-800 to-blue-900 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl`}>
        <div className="flex items-center justify-between p-6 border-b border-blue-700/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-blue-900 shadow-lg">
              VĐ
            </div>
            <h1 className="text-xl font-bold">Võ Đạo</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden hover:bg-blue-700/50 p-1 rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            // <button
            //   key={item.id}
            //   onClick={() => {
            //     setCurrentPage(item.id);
            //     setSidebarOpen(false);
            //   }}
            //   className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-200 ${
            //     currentPage === item.id 
            //       ? 'bg-white text-blue-900 shadow-lg transform scale-105' 
            //       : 'hover:bg-blue-700/50 hover:translate-x-1'
            //   }`}
            // >
            //   <item.icon size={20} />
            //   <span className="font-medium">{item.label}</span>
            // </button>

            <NavLink
              onClick={() => {
                setCurrentPage(item.id);
                setSidebarOpen(false);
              }}
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-200 ${isActive ? "bg-white text-blue-900 shadow-lg transform scale-105" : "hover:bg-blue-700/50 hover:translate-x-1"}`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700/50 bg-blue-950/30">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-700/50 transition-all duration-200 hover:translate-x-1">
            <LogOut size={20} />
            <span className="font-medium">Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {menuItems.find(item => item.id === currentPage)?.label}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Quản lý câu lạc bộ võ thuật</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-linear-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-xl border border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-3 border-blue-600 shadow-lg ring-2 ring-blue-100" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          <Outlet/>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

