const getDay = (num) => {
    const days = {
        2: "Thứ 2",
        3: "Thứ 3",
        4: "Thứ 4",
        5: "Thứ 5",
        6: "Thứ 6",
        7: "Thứ 7",
        8: "CN",
    }

    return days[num];
}

export default getDay;