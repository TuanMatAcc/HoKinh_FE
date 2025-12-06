// Skeleton Component
const Skeleton = ({ className = "", variant = "rectangular" }) => {
  const baseClass = "animate-pulse bg-gray-200";
  const variantClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
      ? "rounded"
      : "rounded-lg";

  return <div className={`${baseClass} ${variantClass} ${className}`}></div>;
};

// Equipment Row Skeleton Component
const EquipmentRowSkeleton = () => {
  return (
    <tr className="border-b">
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-32" variant="text" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-40" variant="text" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-16" variant="text" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-7 w-20 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-7 w-24 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-7 w-20 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-7 w-16 rounded-full" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32" variant="text" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-32" variant="text" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-9 w-9" />
      </td>
    </tr>
  );
};

// Multiple Skeleton Rows Component
export const EquipmentTableSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <EquipmentRowSkeleton key={index} />
      ))}
    </>
  );
};
