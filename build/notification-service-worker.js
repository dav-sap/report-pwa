'use strict';

self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var title = 'Yay a message.';
    var body = 'We have received a push message.';
    var icon = '/images/icon-192x192.png';
    var tag = 'simple-push-demo-notification-tag';
    var data = {
        doge: {
            wow: 'such amaze notification data'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag,
            data: data
        })
    );
}),
self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
}) ,
    self.addEventListener('notificationclick', function(e) {
        console.log("LOOOOOOOOOPOPOPOPOL");
        var notification = e.notification;
        var primaryKey = notification.data.primaryKey;
        var action = e.action;

        if (action === 'close') {
            notification.close();
        } else {
            clients.openWindow('http://www.example.com');
            notification.close();
        }
    });