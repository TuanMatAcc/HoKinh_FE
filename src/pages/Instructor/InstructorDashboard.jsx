import {
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

function InstructorDashboardPage() {
  const menuItems = [
    { id: "sessions", icon: Calendar, label: "Lịch dạy", path: "lich_day" },
    { id: "statistics", icon: Calendar, label: "Thống kê", path: "thong_ke" },
  ];

  return (
    <DashboardLayout
        menuItems={menuItems}
        description={"Trang thông tin giảng viên"}
    />
  );
}

export default InstructorDashboardPage;