import { useEffect, useState } from "react";
import { FacilityTrashSection } from "./facility_trash";
import { facilityService } from "../../../services/facility_api";
import { awardService } from "../../../services/award_api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import AwardTrash from "./award_trash";

export function TrashSection({tab, setData}) {
    const queryKey = ["deleted_" + tab];
    const queryFns = {
        "deleted_awards" : () => awardService.getAllDeletedAwards()
    };

    const { isError, isPending, isSuccess, data } = useQuery({
        queryKey: queryKey,
        queryFn: queryFns[queryKey[0]],
        staleTime: 0
    });

    const [deletedAwards, setDeletedAwards] = useState(Array.isArray(data?.data) ? data.data : []);

    useEffect(() => {
        if(Array.isArray(data?.data)) {
            setDeletedAwards(data.data);
        }
    }, [data, isSuccess]);

    const getTotalDeletedCount = () => {
        return deletedAwards.length;
    }


    const trashDescription = (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div>
                <h3 className="text-xl font-semibold text-gray-800">Thùng Rác</h3>
                <p className="text-sm text-gray-500 mt-1">Các mục đã xóa - Khôi phục hoặc xóa vĩnh viễn</p>
            </div>
            {getTotalDeletedCount() > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                    {getTotalDeletedCount()} mục trong thùng rác
                </span>
                </div>
            )}
        </div>
    );

    if(tab === "awards") {
        return (
            <>
                <div className="space-y-6">
                    {trashDescription}
                    {/* {isPending && (<div>
                        Load
                    </div>)}
                    {isError && (<div>
                        Lỗi
                    </div>)} */}
                    { // isSuccess && ****
                        <AwardTrash deletedAwards={deletedAwards} setAwards={setData} setDeletedAwards={setDeletedAwards}/>
                    }
                </div>
                
                
            </>
        );
    }
}