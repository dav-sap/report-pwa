const SERVER_URL = "https://flex-server.herokuapp.com";
// const SERVER_URL = "http://localhost:3141";
const SITE_URL = "https://pwa-first-71a09.firebaseapp.com";
'use strict';

function createAdminNoti(jsonData, e) {
    let options = {
        body: jsonData.body,
        icon: 'mdpi.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            name: jsonData.name,
            email: jsonData.email,
        },
        actions: [
            {
                action: 'Accept', title: 'Accept',
                icon: 'images/checkmark.png'
            },
            {
                action: 'Deny', title: 'Deny',
                icon: 'images/xmark.png'
            },
        ]
    };
    e.waitUntil(
        self.registration.showNotification(jsonData.title, options)
    );
}
function createUser(jsonData, e) {
    clients.matchAll().then(function(clis) {

        if (clis.length === 0) {
            console.log('Application is already open!');
            let client = clis.find(c => {
                c.visibilityState === 'visible';
            });
            if (client !== undefined) {
                client.focus();
            } else {
                console.log('All Clients are not visible!!!');
                // clients.openWindow("http://localhost:3210/");

            }
        }


        let options = {
            body: jsonData.body,
            icon: 'mdpi.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                name: jsonData.name,
                email: jsonData.email,
            },
            actions: [
                    {
                    action: 'Go to App', title: 'Go to App',
                    icon: 'images/checkmark.png'
                },
            ]
        };
        e.waitUntil(
            self.registration.showNotification(jsonData.title, options)
        );
    });


}
self.importScripts("/idb-keyval-min.js"),
self.addEventListener('notificationclose', function(e) {
    let notification = e.notification;
    let primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
}) ,
self.addEventListener('notificationclick', function(e) {
    let notification = e.notification;
    // let dateOfArrival = notification.data.dateOfArrival;
    let action = e.action;
    let reqProps = {
        method: 'POST',
        headers:new Headers({
            name: notification.data.name,
            email: notification.data.email,
        })
    };
    if (action === 'Deny') {
        fetch(SERVER_URL + "/deny_user", reqProps)
            .then(res => {
                console.log('res from add user: ', res);
            });
        notification.close();
    } else if (action === 'Accept'){
        fetch(SERVER_URL + "/add_user", reqProps)
            .then(res => {
                console.log('res from add user: ', res);
            });
        notification.close();
    }else if (action === 'Go to App'){
        clients.openWindow(SITE_URL);
        notification.close();
    }
}) ,
self.addEventListener('push', function(e) {
    if (e.data) {
        console.log(e.data.text());
        let jsonData = JSON.parse(e.data.text());
        if (jsonData.admin) {
            createAdminNoti(jsonData, e);
        } else if (jsonData.approved){
            idbKeyval.set('user', jsonData.name);
            idbKeyval.set('waitAuth', false);
            createUser(jsonData, e);
        }
    } else {
        console.log('Push message no payload');
        console.log(JSON.stringify(e));
    }

});