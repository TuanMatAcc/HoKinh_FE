import { Calendar } from "lucide-react";
import { DashboardLayout } from "../../components/DashboardLayout";

function StudentDashboardPage() {
  const menuItems = [
    { id: "sessions", icon: Calendar, label: "Lịch học", path: "lich_hoc" }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      description={"Trang thông tin võ sinh"}
    />
  );
}

export default StudentDashboardPage;
