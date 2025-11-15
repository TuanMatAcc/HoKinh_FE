import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { awardService } from "../../../services/award_api";
import { AwardCard } from "./award_card";
import { Plus } from "lucide-react";
import { ThreeDotLoader } from "../../../components/ActionFallback";
import { Trophy } from 'lucide-react';
import { BranchesSkeleton } from "../../facility/components/facility_skeleton";
import { TrashSection } from "../../trash/components/trash_section";
import { LoadingErrorUI } from "../../../components/LoadingError";

export function AwardSection() {

    const { isError, isPending, isSuccess, data, refetch } = useQuery({
        queryKey: ['award'],
        queryFn: () => awardService.getDataHomepage(),
        staleTime: 0
    });
    
    const [awards, setAwards] = useState(Array.isArray(data?.data) ? data.data : []);
    const [savingNewAward, setSavingNewAward] = useState(false);
    const [trashTab, setTrashTab] = useState("");

    const [editingAward, setEditingAward] = useState(null);

    useEffect(() => {
      if(Array.isArray(data?.data)) {
        setAwards(data.data);
      }
    }, [data]);

    const addAward = async () => {
      const newAward = {
          id: null,
          name: 'Giải thưởng mới',
          rank: 'Giải Nhất',
          description: '',
          image: '',
          year: new Date().getFullYear()
      };
      setSavingNewAward(true);
      const createdAward = (await awardService.create(newAward)).data;
      setSavingNewAward(false);
      setAwards([createdAward, ...awards]);
      
      setEditingAward(createdAward.id);
    };

    return (
        <>
          <div className="flex">
            <button
              onClick={() => setTrashTab('')}
              className={`flex-1 flex justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                trashTab === ''
                  ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {/* <MapPin size={18} /> */}
              Giải thưởng
            </button>
            <button
              onClick={() => setTrashTab('awards')}
              className={`flex-1 flex justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                trashTab === 'awards'
                  ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {/* <Trophy size={18} /> */}
              Thùng rác
            </button>
          </div>

          {isPending && <BranchesSkeleton/>}
          {isError && <LoadingErrorUI refetchData={refetch} errorMessage="Không thể tải thông tin giải thưởng"/>}
          {savingNewAward && (
            <ThreeDotLoader size="md" color="gray" message='Đang tạo giải thưởng' />
          )}
          {isSuccess && trashTab === '' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Quản Lý Giải Thưởng</h3>
                  <p className="text-sm text-gray-500 mt-1">Thêm, chỉnh sửa hoặc xóa giải thưởng và thành tích</p>
                </div>
                <button
                  onClick={addAward}
                  className="flex items-center gap-2 bg-linear-to-r from-yellow-500 to-yellow-600 text-white px-5 py-2.5 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={20} />
                  <span className="font-medium">Thêm Giải Thưởng</span>
                </button>
              </div>

              {awards.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-gray-300">
                  <Trophy size={60} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có giải thưởng nào</h3>
                  <p className="text-gray-500 mb-4">Nhấn "Thêm Giải Thưởng" để bắt đầu thêm thành tích</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {awards.map(award => (
                    <AwardCard 
                      key={award.id} 
                      award={award} 
                      editingAward={editingAward} 
                      setEditingAward={setEditingAward}
                      setAwards={setAwards}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {trashTab === 'awards' && <TrashSection setData={setAwards} tab={"awards"}/>}
          
        </>
    );
}