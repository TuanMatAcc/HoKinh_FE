import { useState } from "react";
import { Building2, ChevronDown } from "lucide-react";

const FacilitySelector = ({
  facilityMap,
  selectedFacility,
  setSelectedFacility,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (facilityId) => {
    setSelectedFacility(facilityId);
    setIsOpen(false);
  };

  const selectedFacilityName =
    facilityMap[selectedFacility]?.facilityName || "Chọn cơ sở";

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="relative inline-block w-150">
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn cơ sở
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">
              {selectedFacilityName}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {Object.entries(facilityMap).map(([id, facility]) => (
                <button
                  key={id}
                  onClick={() => handleSelect(parseInt(id))}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 ${
                    selectedFacility === parseInt(id)
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  {facility.facilityName}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FacilitySelector;