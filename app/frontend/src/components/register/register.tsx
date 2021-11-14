import { FunctionalComponent, h } from 'preact';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { useLoginState } from '../../hooks/use-loginstate';
import { checkIfDeviceExists } from '../../services/apiservice';
import { login, logoff } from '../../services/loginservice';
import type { Device } from '../../types/localdevice';

const toggleLoginStatus = async (event: any /* Event */): Promise<boolean> => {
    if (event.target && event.target.checked) {
        return await login();
    } else {
        return await logoff();
    }
}

const Register: FunctionalComponent = () => {
    const ref = useRef<Snackbar>();
    const isLoggedIn = useLoginState();
    const loginCb = useCallback(toggleLoginStatus, []);

    // todo
    /*
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

    return (
        <div>
            Subscribe to notifications <Switch onChange={loginCb} checked={isLoggedIn} />
            <Snackbar ref={ref} />
        </div>
    );
};

export default Register;