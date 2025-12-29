import { useEffect, useRef, useState } from "react";
import { BranchCard } from "./facility_card";
import { useQuery } from "@tanstack/react-query";
import { facilityService } from "../../../services/facility_api";
import { BranchesSkeleton } from "./facility_skeleton";
import { LoadingErrorUI } from "../../../components/LoadingError";
import AnnouncementUI from "../../../components/Announcement";

export function BranchesSection() {
  const { isError, isSuccess, isPending, data, fetchStatus, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: () => facilityService.getAllFacilitiesWebsiteManagement(),
    refetchOnMount: "always",
    staleTime: 0
  });

  const allBranches = useRef([]);

  const [branches, setBranches] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [allowAddBranch, setAllowAddBranch] = useState(true);
  const currentNewBranchId = useRef(null);

  useEffect(() => {
    if(Array.isArray(data?.data)) {
      allBranches.current = data.data;
      setBranches(data.data);
    }
  }, [data, fetchStatus])

  const switchBranch = (id) => {
    if(id === "all") {
        setBranches(allBranches.current);
        return;
    }
    let index = 0;
    for(let i = 0; i < allBranches.current.length; i++) {
        if(allBranches.current[i].id.toString() === id) {
            index = i;
        }
    }
    setBranches([allBranches.current[index]]);
  };

  const addBranch = () => {
    if(editingBranch !== null) {
      setAllowAddBranch(false);
      return;
    }
    // Check whether the branch is new or not
    const newBranchId = Date.now();
    currentNewBranchId.current = newBranchId;

    const newBranch = {
      id: newBranchId,
      name: 'Chi nhánh mới',
      address: '',
      phoneNumber: '',
      mapsLink: '',
      image: '',
      classes: []
    };
    
    setBranches([newBranch, ...branches]);
    setEditingBranch(newBranch.id);
  };


  return (
    <>
      {!allowAddBranch && 
        <AnnouncementUI setVisible= {setAllowAddBranch} 
                        message= {"Đang chỉnh sửa chi nhánh không thể thêm chi nhánh khác."} 
        />
      }
      {isPending && <BranchesSkeleton/>}
      {isError && <LoadingErrorUI refetchData={refetch} errorMessage="Không thể tải thông tin cơ sở"/>}
      {isSuccess && <div>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Quản Lý Chi Nhánh</h3>
            <p className="text-sm text-gray-500 mt-1">Chỉnh sửa thông tin chi nhánh hiển thị trên website</p>
          </div>
          
        </div>

        <div className="mb-6 flex flex-col justify-between items-start gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <label htmlFor='branches' className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lựa chọn chi nhánh</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg 
                          className="w-5 h-5 text-gray-400 dark:text-gray-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                      >
                          <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                          />
                      </svg>
                  </div>
                  <select
                      id="branches"
                      onChange={(e) => switchBranch(e.target.value)}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-white text-sm rounded-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
                          block w-full pl-10 pr-10 py-3
                          cursor-pointer shadow-sm
                          hover:border-gray-400 dark:hover:border-gray-500
                          hover:shadow-md transition-all duration-200
                          appearance-none
                          bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                          dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%239ca3af%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                          bg-size-[1.5em_1.5em] bg-position-[right_0.5rem_center] bg-no-repeat"
                      defaultValue="all"
                      >
                      <option key="default" value="" disabled>Chọn chi nhánh</option>
                      <option key= "all" value="all">Tất cả chi nhánh</option>
                      {allBranches.current.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                        {branch.name}
                        </option>
                      ))}
                  </select>
              </div>
        </div>
            

        {branches.map(branch => (
          <BranchCard key={branch.id} 
                      allBranches = {allBranches}
                      branches={branches} 
                      branch={branch} 
                      editingBranch={editingBranch} 
                      setBranches={setBranches} 
                      setEditingBranch={setEditingBranch}
          />
        ))}
      </div>
      }
    </>
  );
}