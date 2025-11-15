
import { AlertCircle, RefreshCw } from 'lucide-react';

export function LoadingErrorUI({errorMessage, refetchData}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-200">
    {/* Error Icon */}
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} className="text-blue-600" />
      </div>
      
      {/* Error Message */}
      <h4 className="text-xl font-bold text-gray-800 mb-2">
        {errorMessage}
      </h4>
      <p className="text-gray-600 mb-6 max-w-md">
        Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
      </p>
      
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={refetchData}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
          Thử lại
        </button>
        <button
          onClick={() => console.log('Go back')}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
  );
}