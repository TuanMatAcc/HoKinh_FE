
const Banner = ({message, image}) => {
    return (
        <div className="max-w-7xl flex flex-col items-center">
            <img src={image} alt="" className="w-48"/>
            <span className="text-blue-300 text-2xl">
                {message}
            </span>
        </div>
    );
}

export default Banner;