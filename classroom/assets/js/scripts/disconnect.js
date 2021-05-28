'use strict';

function goToDisconnect() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: "/routing/Routing.php?controller=user&action=disconnect",
            success: function (response) {
                resolve(JSON.parse(response))
            },
            error: function () {
                reject();
            }
        });
    }).then(()=>{
        window.location = '/classroom/';
    }).catch((e)=>{
        console.log(e);
    });
}