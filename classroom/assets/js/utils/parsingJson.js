function tryToParse(response) {
    try {
        return JSON.parse(response);
    } catch(e) {
        return false;
    }
}