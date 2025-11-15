const formatDate = ({dateString, showTime, region}) => {
    if(showTime) {
        return new Date(dateString).toLocaleDateString(region, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).replace('lúc', '').trim();
    }
    else {
        return new Date(dateString).toLocaleDateString(region, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
};
export default formatDate;