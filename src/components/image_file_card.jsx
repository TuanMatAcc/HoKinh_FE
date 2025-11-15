import { Trash2, RefreshCcw } from 'lucide-react';

export function ImageFileCard({imagePath, typeAction, handleAction}) {

    return (
        <div className='mt-3'>
            <div className='relative inline-block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow'>
                <img
                    src={imagePath}
                    alt="Preview"
                    className="w-48 h-48 object-cover"
                />
                
                {typeAction === 'delete' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 flex justify-end">
                        <button
                            onClick={handleAction}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1.5 text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            Xóa
                        </button>
                    </div>
                )}

                {typeAction === 'restore' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3 flex justify-end">
                        <button
                            onClick={handleAction}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-1.5 text-sm font-medium"
                        >
                            <RefreshCcw size={16} />
                            Khôi phục
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}