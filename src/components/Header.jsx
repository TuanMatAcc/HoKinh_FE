// Header Component
const Header = ({ title, description, backButton, functionButton }) => (
  <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6 mb-6">
    <div>
      {backButton}
      <h1 className="text-3xl font-bold text-blue-900 mb-2">{title}</h1>
      <p className="text-blue-600">{description}</p>
    </div>
    {functionButton}
  </div>
);

export default Header;