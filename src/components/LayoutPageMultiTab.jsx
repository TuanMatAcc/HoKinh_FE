import { useState } from "react";
// child component is components included in tabs
const MultiTabLayout = ({ tabs, isChildComponent }) => {
  const [selectedTab, setSelectedTab] = useState("session");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      {!isChildComponent && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2">
            {tabs &&
              Object.entries(tabs).map(([tabName, val]) => (
                <button
                  key={tabName}
                  onClick={() => setSelectedTab(tabName)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    selectedTab === tabName
                      ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <val.icon size={20} />
                  {val.label}
                </button>
              ))}
          </div>
        </div>
      )}

      {tabs[selectedTab] && tabs[selectedTab].component}
    </div>
  );
};

export default MultiTabLayout;