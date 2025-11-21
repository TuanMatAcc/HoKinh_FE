import {
  Users,
  Plus,
} from "lucide-react";

// Students Section Component
const StudentsSection = ({ students, onDelete }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Võ Sinh ({students.length})
      </h4>
      <button className="text-blue-600 hover:text-blue-700">
        <Plus className="w-4 h-4" />
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between bg-white rounded p-2"
        >
          <span className="text-sm text-gray-900">{student.name}</span>
          {!student.isRegular && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              Trái buổi
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default StudentsSection;
