import { Calendar, Settings } from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

function StudentDashboardPage() {
  const menuItems = [
    { id: "sessions", icon: Calendar, label: "Lịch học", path: "lich_hoc" },
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
      description={"Trang thông tin võ sinh"}
    />
  );
}

export default StudentDashboardPage;
