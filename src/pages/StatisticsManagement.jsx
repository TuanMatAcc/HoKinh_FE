import { useState } from "react";
import { Calendar } from "lucide-react";
import DateRangeSelector from "../components/DateRangeSelector";
import MultiTabLayout from "../components/LayoutPageMultiTab";
import SessionStatisticsUI from "../features/statistics/session/components/SessionStatisticsManagement.jsx";
import FacilitySelector from "../components/FacilitySelector.jsx";
import { useFacility } from "../hooks/useFacilityData.js";

const StatisticsManagement = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: facilities } = useFacility();
  const [selectedFacility, setSelectedFacility] = useState(1);
  const [isChildComponent, setIsChildComponent] = useState(false);
  const facilityMap = useMemo(() => {
      if (!facilities?.data) return {};
  
      return facilities.data.reduce((map, facility) => {
        map[facility.id] = { facilityName: facility.name };
        return map;
      }, {});
    }, [facilities]);
  
    const classMap = useMemo(() => {
      if (!facilities?.data) return {};
  
      return facilities.data.reduce((map, facility) => {
        facility.classes.forEach((cls) => {
          map[cls.id] = {
            className: cls.name,
            facilityId: facility.id,
          };
        });
        return map;
      }, {});
    }, [facilities]);
  const tabs = {
    session: {
      component: (
        <SessionStatisticsUI
          setIsChildComponent={setIsChildComponent}
          startDate={startDate}
          endDate={endDate}
          facilityMap={facilityMap}
          classMap={classMap}
          selectedFacility={selectedFacility}
        />
      ),
      icon: Calendar,
      label: "Buổi học",
    }
  };
  return (
    <div className="mx-auto max-w-7xl">
      {!isChildComponent && (
        <>
          <FacilitySelector
            facilityMap={facilityMap}
            selectedFacility={selectedFacility}
            setSelectedFacility={setSelectedFacility}
          />
          <div className="h-6"></div>
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </>
      )}
      <div className="h-6"></div>
      <MultiTabLayout tabs={tabs} isChildComponent={isChildComponent} />
    </div>
  );
}

export default StatisticsManagement;