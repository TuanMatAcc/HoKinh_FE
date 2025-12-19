import { useQuery } from "@tanstack/react-query";
import DateRangeSelector from "../../components/DateRangeSelector";
import { useState, useEffect } from "react";
import { sessionService } from "../../services/session_api";
import MultiTabLayout from "../../components/LayoutPageMultiTab";
import { ThreeDotLoader } from "../../components/ActionFallback";
import SessionStatisticsForInstructorUI from "../../features/statistics/session/components/instructor/SessionStatisticsForInstructor";
import { Calendar } from "lucide-react";

const SessionStatisticsInstructor = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    const {data: sessionData} = useQuery({
        queryKey: ['session', 'statistics', 'instructor-use', startDate, endDate],
        queryFn:() => sessionService.getSessionStatisticsForInstructor(startDate, endDate),
        staleTime: 600000,
        enabled: !!(startDate && endDate)
    })
    
    const [isChildComponent, setIsChildComponent] = useState(false);
    const [inProgress, setInProgress] = useState("");
    const tabs = {
      session: {
        component: (
          <SessionStatisticsForInstructorUI
            setIsChildComponent={setIsChildComponent}
            startDate={startDate}
            endDate={endDate}
            facilityMap={sessionData?.data ? sessionData.data.facilityMap : {}}
            classMap={sessionData?.data ? sessionData.data.classMap : {}}
            sessionStatistics={sessionData?.data ? sessionData.data : null}
          />
        ),
        icon: Calendar,
        label: "Buổi học",
      }
    };
    
    useEffect(() => {
    if (!sessionData && startDate && endDate) {
        setInProgress("Đang tải dữ liệu. Vui lòng chờ");
    } else {
        setInProgress("");
    }
    }, [sessionData]);

    return (
      <div className="mx-auto max-w-7xl">
        {inProgress && <ThreeDotLoader message={inProgress} />}
        {!isChildComponent && (
          <DateRangeSelector
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        )}
        <div className="h-6"></div>
        <MultiTabLayout tabs={tabs} isChildComponent={isChildComponent} />
      </div>
    );
}

export default SessionStatisticsInstructor;