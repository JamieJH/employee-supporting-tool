
export const timestampInSecsToDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-UK");  // format dd/mm/yyyy
}

export const dateStringToInputTypeDateFormat = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
}

export const dateStringToTimestampSecs = (dateString) => {
    return new Date(dateString).getTime() / 1000;
}

export const timestampMsToInputDate = (timestamp) => {
    const dateString = timestampInSecsToDate(timestamp);
    return dateStringToInputTypeDateFormat(dateString);
}