function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function changeLang(code) {
    let d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); //set cookie for 1 years
    setCookie("lng", code, d.toUTCString())
    location.reload();
}