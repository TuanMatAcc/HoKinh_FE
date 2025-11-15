import {Check} from 'lucide-react'

const SuccessAnnouncement = ({actionAnnouncement, detailAnnouncement, onBack}) => {

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{actionAnnouncement}</h2>
          <p className="text-gray-600 mb-6">{detailAnnouncement}</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            OK
          </button>
        </div>
    );
}

export default ActionAnnouncement;