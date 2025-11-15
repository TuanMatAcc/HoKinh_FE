export function ThreeDotLoader({ size = 'md', color = 'blue', message= 'Đang thao tác...' }) {
  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };
  
  const colors = {
    blue: 'bg-blue-300',
    white: 'bg-white',
    gray: 'bg-gray-300'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <div className="flex items-center justify-center gap-2">
        <div className={`${sizes[size]} ${colors[color]} rounded-full animate-hard-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${sizes[size]} ${colors[color]} rounded-full animate-hard-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${sizes[size]} ${colors[color]} rounded-full animate-hard-bounce`} style={{ animationDelay: '300ms' }} />
      </div>
      <p className="mt-4 text-gray-700 text-center">{message}</p>
    </div>
  </div>
  );
}