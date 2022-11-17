import { FunctionalComponent, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import { useLogin } from '../../hooks/use-login';

import PasswordDialog from '../dialog/dialog';
import style from './register.css';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import { LoginStatus } from '../../services/loginservice';
import { useInstall } from '../../hooks/use-install';
import { useIsProtected } from '../../hooks/use-isprotected';


const Register: FunctionalComponent = () => {
    const snackbarRef = useRef<Snackbar>();
    const [isLoggedIn, setLoginState] = useLogin();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [showReloadButton, setShowReloadButton] = useState<boolean>(false);
    const [showDialog, setDialog] = useState<boolean>(false);
    const installInfo = useInstall();
    const installCallback = useCallback(() => installInfo?.prompt(), [installInfo]);

    const isPasswordProtected = useIsProtected();

    const showSnackbar = useCallback((message: string, timeout: number = 7000) => {
        snackbarRef.current?.MDComponent.show({ message, timeout });
    }, [snackbarRef]);

    const setLogin = useCallback(async (shouldDoLogin: boolean, password?: string) => {
        setLoading(true);
        try {
            const loginSuccess = await setLoginState(shouldDoLogin, password);
            setDialog(LoginStatus.LOGIN_PASSWORD_REQUIRED === loginSuccess && shouldDoLogin);
            setShowReloadButton(true);
        } catch (e: any) {
            showSnackbar(`Login action failed: ${e}`);
            console.warn(e);
        } finally {
            setLoading(false);
        }
    }, [setLoginState, setLoading, setDialog, setShowReloadButton, showSnackbar]);

    const onDialogExit = useCallback((key?: string) => {
        setDialog(false);
        key && setLogin(true, key);
    }, [setLogin, setDialog]);

    useEffect(() => {
        if (isPasswordProtected) {
            showSnackbar('This Notify instance is password protected. Please login to use it.', 3_000);
        }        
    }, [isPasswordProtected, showSnackbar]);

    return (
        <div>
            <div class={style.headline}>
                <div class={style.switchwrapper}>
                    <Switch class={style.padding}
                        onChange={(e: any) => setLogin(e.target.checked, undefined)}
                        checked={isLoggedIn === LoginStatus.LOGGED_IN} />

                    {isLoading && "loading"}
                    {showReloadButton && <Button outlined class={style.smallbtn} onClick={() => location.reload()}>reload</Button>}
                </div>
                <div></div>
                <div>
                    {installInfo && <Button outlined class={style.smallbtn} onClick={installCallback}>install</Button>}
                </div>
            </div>
            <PasswordDialog isOpened={showDialog} setPassword={onDialogExit} />
            <Snackbar ref={snackbarRef} />
        </div>
    );
};

export default Register;