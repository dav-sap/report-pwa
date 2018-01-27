export const applicationServerPublicKey = 'BCKvDKBurBXsf-WJ4r8Sn-qEzMMN6Ntsw8VFvxnM1XS-pYVj4cVbFgM__I8wbes4au2C3pzU8e9hcsp_i7y87Ww';

export function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function ServerBadResponseException(message, status) {
    this.message = message;
    this.status = status;
    this.name = 'ServerBadResponseException';
}