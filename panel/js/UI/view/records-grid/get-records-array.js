const getRecordsArray = () => {
    return document.getElementById("records-grid").getElementsByTagName("tr");
}

export { getRecordsArray }