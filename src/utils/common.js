const getWeekDay = (year, month, date) => {
    return new Date(year, month, date).getDay();
}

const truncate = (str, n) => {
    if (!str) return "";
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
};

export { getWeekDay, truncate };