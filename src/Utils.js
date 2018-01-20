const applicationServerPublicKey = 'BCKvDKBurBXsf-WJ4r8Sn-qEzMMN6Ntsw8VFvxnM1XS-pYVj4cVbFgM__I8wbes4au2C3pzU8e9hcsp_i7y87Ww';


function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function unsubscribeUser() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(reg) {
            reg.pushManager.getSubscription()
                .then(function (subscription) {
                    if (subscription) {
                        return subscription.unsubscribe();
                    }
                })
                .catch(function (error) {
                    console.log('Error unsubscribing', error);
                })
                .then(function () {
                    console.log('User is unsubscribed.');
                });
        });
    }
}
export function subscribeUser(name, email) {

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(reg) {
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            }).then(function(sub) {
                let subJson = JSON.stringify(sub);
                console.log(subJson);
                let reqProps = {
                    method: 'POST',
                    headers:new Headers({
                        name: name,
                        email: email,
                        sub: subJson,
                    })
                };

                fetch("/register", reqProps)
                    .then(res => {
                        console.log('res: ', res);
                    })

            }).catch(function(e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for notifications was denied');
                } else {
                    console.error('Unable to subscribe to push', e);
                }
            });
        })
    }
}