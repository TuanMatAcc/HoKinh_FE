const Button = ({title, icon, handleOnClick, background = true, font=''}) => {
    if(background) {
        return (
          <button
            onClick={handleOnClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            {icon}
            <span className={font}>{title}</span>
          </button>
        );
    }
    return (
      <button
        onClick={handleOnClick}
        className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-700 transition"
      >
        {icon}
        <span className={font}>{title}</span>
      </button>
    );
};

export default Button;