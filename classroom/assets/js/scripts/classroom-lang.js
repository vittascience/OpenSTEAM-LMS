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
    //delete all cookies lng
    deleteAllCookiesWithPrefix("lng");
    let d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); //set cookie for 1 years
    setCookie("lng", code, d.toUTCString())
    location.reload();
}

function deleteAllCookiesWithPrefix(prefix) {
    // Récupérer tous les cookies actuellement définis
    let cookies = document.cookie.split(';');
    // Parcourir tous les cookies
    cookies.forEach(function(cookie) {
        // Supprimer les cookies qui commencent par le préfixe spécifié
        let cookieName = cookie.split('=')[0].trim();
        if (cookieName.startsWith(prefix)) {
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    });
}