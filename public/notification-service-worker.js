const SITE_URL = "https://flex-server.herokuapp.com/";
'use strict';
const filesToCache = [
    "/images/admin-settings.png", "/images/dates.png", "/images/everyone.png", "/images/loc.png", "/images/next-button.png",
    "/images/noti-off.png", "/images/noti-on.png", "/images/user-home.png", "/images/v.png", "/images/x.png","/images/waitAuth.png"

];

const staticCacheName = 'pages-cache-v1';

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
                icon: 'images/v.png'
            },
            {
                action: 'Deny', title: 'Deny',
                icon: 'images/x.png'
            },
        ]
    };
    e.waitUntil(
        self.registration.showNotification(jsonData.title, options)
    );
}
function createAdminMessageNoti(jsonData, e) {
    let options = {
        body: jsonData.body,
        icon: 'mdpi.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
        },
        actions: [
        ]
    };
    e.waitUntil(
        self.registration.showNotification(jsonData.title, options)
    );
}
function createReportNoti(jsonData, e) {
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
            }
        }
    });
    let options = {
        body: jsonData.body,
        icon: 'mdpi.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
        },
        actions: [
            {
                action: 'arriving', title: 'Arriving!',
                icon: 'images/superman.png'
            },
            {
                action: 'goToApp', title: 'Send Report',
                icon: 'images/report.png'
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
            }
        }
    });
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
                action: 'goToApp', title: 'Go to App',
            },
        ]
    };
    e.waitUntil(
        self.registration.showNotification(jsonData.title, options)
    );
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
    if (action === 'goToApp'){
        clients.openWindow(SITE_URL);
        notification.close();
    }else if (action === 'goToWhere'){
        clients.openWindow(SITE_URL + "/where-is-everyone");
        notification.close();
    }
    else if (action === 'arriving'){
        console.log("arriving");
        idbKeyval.get('user').then((user) => {
            console.log("arriving", user);
            let today = new Date();
            today.setTime(today.getTime() + ((-1*today.getTimezoneOffset())*60*1000));
            let todayStr = today.toISOString();
            todayStr = todayStr.substr(0, todayStr.lastIndexOf(':'));

            let reqProps = {
                method: 'POST',
                headers: new Headers({
                    'content-type': 'application/json',
                    'user': user.email + ":" + user.password
                }),
                body: JSON.stringify({
                    email: user.email,
                    startDate: todayStr,
                    endDate: todayStr,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    status: "Arriving",
                    statusDesc: "",
                    note: "",
                    repeat: 0,
                    allDay: true,
                })
            };
            fetch("/add_report", reqProps)
                .then(res => {
                    if (res.status !== 200) {
                        throw new Error("Error Connecting");
                    }
                })
                .catch(err => {
                    console.error("Error send report")
                });
        });
        
        notification.close();
    }
    else if (action === 'Deny') {
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                name: notification.data.name,
                email: notification.data.email,
            })
        };
        fetch("/deny_user", reqProps)
            .then(res => {
                console.log('res from deny user: ', res);
            });
        notification.close();
    } else if (action === 'Accept') {
        let reqProps = {
            method: 'POST',
            headers: new Headers({
                name: notification.data.name,
                email: notification.data.email,
            })
        };
        fetch("/add_user", reqProps)
            .then(res => {
                console.log('res from add user: ', res);
            });
        notification.close();
    }
    else {
        clients.openWindow(SITE_URL);
        notification.close();
    }
}),
self.addEventListener('push', function(e) {
    if (e.data) {
        console.log(e.data.text());
        let jsonData = JSON.parse(e.data.text());
        if (jsonData.admin) {
            createAdminNoti(jsonData, e);
        } else if (jsonData.approved){
            idbKeyval.set('user', {name: jsonData.name, email: jsonData.email, subscription: jsonData.sub, loc:jsonData.loc});
            idbKeyval.set('waitAuth', false);
            idbKeyval.set('waitingUser', {});
            createUser(jsonData, e);
        }
        else if (jsonData.approved === false){
            idbKeyval.set('user', null);
            idbKeyval.set('waitAuth', false);
            idbKeyval.set('waitingUser', {});
            createUser(jsonData, e);
        }
        else if (jsonData.title === "Morning Report") {
            createReportNoti(jsonData, e);
        }
        else if (jsonData.admin_message === true) {
            createAdminMessageNoti(jsonData, e);
        }
    } else {
        console.log('Push message no payload');
        console.log(JSON.stringify(e));
    }

}),
    self.addEventListener('install', function(event) {
        console.log('Attempting to install cache static assets');
        event.waitUntil(
            caches.open(staticCacheName)
                .then(function(cache) {
                    return cache.addAll(filesToCache);
                })
        );
    });
;