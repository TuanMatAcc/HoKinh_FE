const DonutChart = ({ data, colors, size = 200, onSegmentClick, unit="buổi" }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div
        className="rounded-full bg-gray-100 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-gray-400">Không có dữ liệu</span>
      </div>
    );
  }

  let currentAngle = -90;
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const chartRadius = radius * 0.8;
  const holeRadius = chartRadius * 0.6;

  const paths = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    let angle = (item.value / total) * 360;

    // Fix: If this segment is 100%, reduce angle slightly to make arc work
    if (angle >= 360) {
      angle = 359.99;
    }

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + chartRadius * Math.cos(startRad);
    const y1 = centerY + chartRadius * Math.sin(startRad);
    const x2 = centerX + chartRadius * Math.cos(endRad);
    const y2 = centerY + chartRadius * Math.sin(endRad);
    const x3 = centerX + holeRadius * Math.cos(endRad);
    const y3 = centerY + holeRadius * Math.sin(endRad);
    const x4 = centerX + holeRadius * Math.cos(startRad);
    const y4 = centerY + holeRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${chartRadius} ${chartRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${holeRadius} ${holeRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    currentAngle = endAngle;

    return (
      <path
        key={index}
        d={pathData}
        fill={colors[index]}
        className="transition-opacity hover:opacity-80 cursor-pointer"
        onClick={() => onSegmentClick && onSegmentClick(item)}
      />
    );
  });

  return (
    <svg width={size} height={size} className="mx-auto">
      {paths}
      <circle cx={centerX} cy={centerY} r={holeRadius} fill="white" />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-2xl font-bold fill-gray-700"
      >
        {total}
      </text>
      <text
        x={centerX}
        y={centerY + 20}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm fill-gray-500"
      >
        {unit}
      </text>
    </svg>
  );
};

export default DonutChart;