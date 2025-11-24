import { X, Save, Trash2 } from 'lucide-react';

export function ConfirmDialog({action = 'store', title, askDetail, options=['Không', 'Có'], handleCancel, handleConfirm}) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {action === "store" && (
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Save size={24} className="text-white" />
                  </div>
                )}
                {action === "cancel" && (
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <X size={24} className="text-white" />
                  </div>
                )}
                {action === "remove" && (
                  <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <Trash2 size={24} className="text-white" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              {askDetail}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-md"
              >
                {options[0]}
              </button>
              <button
                onClick={handleConfirm}
                className={
                  action === "remove"
                    ? "flex-1 px-6 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    : "flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                }
              >
                {options[1]}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}