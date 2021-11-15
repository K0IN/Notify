import { arraybuffer2base64, createDevice, getVapidData } from './apiservice';

    // todo
    /*
     return await login(); || return await logoff();

    const loginCb = useCallback(async (e: Event) => {
        if (!navigator.serviceWorker || !('PushManager' in window)) {
            if (ref.current) {
                ref.current.MDComponent.show({ message: 'your browser is not supported', timeout: 10000 });
            }
            return false;
        }

        toggleLoginStatus(e).catch(e => {
            if (ref.current) {
                ref.current.MDComponent.show({ message: `unable to register device error: ${e.message}`, timeout: 10000 });
            }
            return false;
        }).then((isLoggedIn: boolean) => {           
            if (isLoggedIn) {
                location.reload()
            }
        });

    }, []);
    */
