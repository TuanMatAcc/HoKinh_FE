import {
  Calendar,
  Settings,
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

function InstructorDashboardPage() {
  const menuItems = [
    { id: "sessions", icon: Calendar, label: "Lịch dạy", path: "lich_day" },
    { id: "statistics", icon: Calendar, label: "Thống kê", path: "thong_ke" },
    {
      id: "account_setting",
      icon: Settings,
      label: "Cài đặt tài khoản",
      path: "cai_dat_tai_khoan",
    },
  ];

  return (
    <DashboardLayout
        menuItems={menuItems}
        description={"Trang thông tin giảng viên"}
    />
  );
}

export default InstructorDashboardPage;