import { Trash2, RotateCcw, Calendar, AlertCircle } from 'lucide-react';
import { awardService } from '../../../services/award_api';
import { useState } from 'react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ThreeDotLoader } from '../../../components/ActionFallback';
import getTimeSinceDeleted from '../../../utils/getTimeSinceDeleted';

const AwardTrash = ({deletedAwards, setDeletedAwards, setAwards}) => {
    
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [deletedId, setDeletedId] = useState(null);

    const handleRestore = async (id) => {
        setInProgress(true);
        // Update isDeleted field
        try {
            const updatedAward = (await awardService.patch(id, {isDeleted: false})).data;
            setInProgress(false);
            // Retrieve restoblue award
            setAwards(prev => ([
                updatedAward, ...prev
            ]));
            setDeletedAwards(prev => prev.filter(award => award.id !== id));
        }
        catch(error) {

        }
    };

    const handlePermanentDelete = async (id) => {
        setShowDeleteDialog('');
        setInProgress(true);
        try {
            await awardService.delete(id);
            setInProgress(false);
            setDeletedAwards(deletedAwards.filter(award => award.id !== id));
        }
        catch(error) {

        }
    };

    const handlePermanentDeleteAll = async () => {
        setShowDeleteDialog('');
        setInProgress(true);
        try {
            await awardService.deleteAll();
            setInProgress(false);
            setDeletedAwards([]);
        }
        catch(error) {

        }
    };

    const getRankBadgeColor = (rank) => {
    switch(rank) {
        case 'Hạng nhất':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
        case 'Hạng nhì':
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
        case 'Hạng ba':
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
        default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
    };

    return (
    <div className="min-h-screen bg-gray-50 p-6">
        {showDeleteDialog === 'delete' && (
            <ConfirmDialog 
                title={"Xóa vĩnh viễn giải thưởng"} 
                askDetail={"Bạn có muốn xóa vĩnh viễn giải thưởng này ?"} 
                options={["Không", "Có"]} 
                handleCancel={() => setShowDeleteDialog("")} 
                handleConfirm={() => handlePermanentDelete(deletedId)}
            />
        )}

        {showDeleteDialog === 'delete_all' && (
            <ConfirmDialog 
                title={"Xóa vĩnh viễn tất cả giải thưởng"} 
                askDetail={"Bạn có chắc chắn muốn xóa vĩnh viễn tất cả giải thưởng ? "} 
                options={["Không", "Có"]} 
                handleCancel={() => setShowDeleteDialog("")} 
                handleConfirm={() => handlePermanentDeleteAll()}
            />
        )}
        {inProgress && (
            <ThreeDotLoader size="md" color="gray" message='Đang thực hiện thao tác...' />
        )}
        <div className="max-w-7xl mx-auto">
            <div>
            {deletedAwards.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-16 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 p-6 rounded-full">
                    <Trash2 size={64} className="text-gray-300" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thùng rác trống</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Các giải thưởng đã xóa sẽ được lưu trữ tại đây. Bạn có thể khôi phục hoặc xóa vĩnh viễn.
                </p>
                </div>
            ) : (
                <>
                {/* Info Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                    <p className="text-sm text-amber-800">
                        <span className="font-semibold">Lưu ý:</span> Các giải thưởng trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn. 
                        Giải thưởng đã xóa vĩnh viễn không thể khôi phục.
                    </p>
                    </div>
                </div>

                {/* Trash Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deletedAwards.map(award => (
                    <div key={award.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-blue-100">
                        {/* Deleted Badge */}
                        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Trash2 size={14} />
                            Đã xóa {getTimeSinceDeleted(award.deletedAt)}
                        </span>
                        <span>{new Date(award.deletedAt).toLocaleDateString('vi-VN')}</span>
                        </div>

                        <div className="relative h-48 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                        <img 
                            src={award.image} 
                            alt={award.name}
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg opacity-80 ${getRankBadgeColor(award.rank)}`}>
                            {award.rank}
                            </span>
                        </div>
                        </div>

                        <div className="p-5">
                        <p className="font-bold text-lg line-clamp-1 text-gray-800 mb-2 gap-2">
                            {award.name}
                        </p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{award.description}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Calendar size={16} />
                            <span>{award.year}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                            <button 
                            onClick={() => handleRestore(award.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md"
                            >
                            <RotateCcw size={16} />
                            Khôi phục
                            </button>
                            <button 
                            onClick={() => {
                                setShowDeleteDialog("delete");
                                setDeletedId(award.id);
                            }}
                            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                            >
                            <Trash2 size={16} />
                            Xóa vĩnh viễn
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Bulk Actions */}
                <div className="mt-6 bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                    <span className="font-semibold">{deletedAwards.length}</span> giải thưởng trong thùng rác
                    </div>
                    <button 
                    onClick={() => setShowDeleteDialog('delete_all')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Trash2 size={18} />
                    Xóa tất cả vĩnh viễn
                    </button>
                </div>
                </>
            )}
            </div>
        </div>
    </div>
    );
};

export default AwardTrash;