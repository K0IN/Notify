import { FunctionalComponent, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { checkIfDeviceExists } from '../../services/apiservice';

import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';

import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';
import type { Device } from '../../types/localdevice';
import { login, logoff } from '../../services/loginservice';

const toggleLoginStatus = async (event: any /* Event */): Promise<boolean> => {
    if (event.target && event.target.checked) {
        return await login();
    } else {
        return await logoff();
    }
}

const Register: FunctionalComponent = () => {
    const [isLoggedIn, setLoginStatus] = useState<boolean>(!!localStorage.userData);
    const ref = useRef<Snackbar>();

    useEffect(() => {
        if (!localStorage.userData) {
            return;
        }
        const userData = JSON.parse(localStorage.userData) as Device;
        checkIfDeviceExists(userData.id).then(setLoginStatus);
    }, []);

    const loginCb = useCallback(async (e: Event) => {
        if (!navigator.serviceWorker || !('PushManager' in window)) {
            if (ref.current) {
                ref.current.MDComponent.show({ message: 'your browser is not supported', timeout: 5000 });
            }
            return false;
        }

        toggleLoginStatus(e).catch(e => {
            if (ref.current) {
                ref.current.MDComponent.show({ message: `unable to register device error: ${e.message}`, timeout: 5000 });
            }
            return false;
        }).then((isLoggedIn: boolean) => {
            setLoginStatus(isLoggedIn);
            if (isLoggedIn) {
                location.reload()
            }
        });

    }, []);

    return (
        <div>
            Subscribe to notifications <Switch onChange={loginCb} checked={isLoggedIn} />
            <Snackbar ref={ref} />
        </div>
    );
};

export default Register;