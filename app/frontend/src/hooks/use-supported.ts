function isPushApiSupported() {
    return 'PushManager' in window;
}

function isNotificationSupported() {
    return 'Notification' in window;
}

export const useIsSupported = () => (isPushApiSupported() && isNotificationSupported());