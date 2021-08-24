const readJsonFromFile = (file) => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            resolve(JSON.parse(reader.result.toString()));
        }
    });
}

export { readJsonFromFile }