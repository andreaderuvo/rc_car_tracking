var writeSession = (log) => {
    if (log) {
        temp = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
        extended = Object.assign(temp, log);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(extended));
    }
}

var updateSession = (key) => {
    temp = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
    delete temp[key];
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(temp));
}