// Legend Component
const ChartLegend = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{item.value}</span>
            <span className="text-sm text-gray-500">
              ({item.percentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;