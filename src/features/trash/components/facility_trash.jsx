import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { facilityService } from "../../../services/facility_api";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { Trash2, RefreshCw, MapPin } from "lucide-react";

export function FacilityTrashSection({data}) {
    console.log(data)
    // const { data } = useQuery({
    //     queryKey: ['deleted_facilities'],
    //     queryFn: facilityService.getAllDeletedFacilities(),
    //     suspense: true,
    //     staleTime: 0
    // });

    const [allDeletedBranches, setAllDeletedBranches] = useState(Array.isArray(data) ? data : []);
    const [showDialog, setShowDialog] = useState(false);
    const [title, setTitle] = useState("");
    const [askDetail, setAskDetail] = useState("");
    const [options, setOptions] = useState(["Không", "Có"]);
    const [handleCancel, setHandleCancel] = useState();
    const [handleConfirm, setHandleConfirm] = useState("");

    return (
        <>
            { allDeletedBranches.length > 0 && (
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
                <MapPin size={20} className="text-red-600" />
                <h4 className="font-semibold text-gray-800">Chi Nhánh ({allDeletedBranches.length})</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                {allDeletedBranches.map(branch => (
                    <div key={branch.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200 opacity-75 hover:opacity-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                            <MapPin size={24} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-gray-800 text-ellipsis">
                            {branch.name || 'Chi nhánh'}
                            </h4>
                            <p className="text-xs text-red-600 font-medium">
                            Xóa: {new Date(branch.deletedAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        </div>
                        <div className="flex gap-2 ml-2">
                        <button
                            onClick={() => {}}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                            title="Khôi phục"
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button
                            onClick={() => {
                            
                            setShowDialog(true);
                            setTitle("Xóa vĩnh viễn chi nhánh");
                            setAskDetail("Bạn có chắc chắn muốn xóa vĩnh viễn chi nhánh này ?");
                            setHandleCancel(() => {
                                showDialog(false)
                            });
                            setHandleConfirm(() => {
                                facilityService.softDelete(branch.id);
                            });

                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                            title="Xóa vĩnh viễn"
                        >
                            <Trash2 size={18} />
                        </button>


                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 min-w-[60px]">Địa chỉ:</span>
                        <span className="text-gray-600">{branch.address || 'Chưa có'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 min-w-[60px]">SĐT:</span>
                        <span className="text-gray-600">{branch.phone || 'Chưa có'}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
            {showDialog && (
                <ConfirmDialog title={title} askDetail={askDetail} options={options} handleCancel={handleCancel} handleConfirm={handleConfirm}/>
            )}
        </>
    );
}


