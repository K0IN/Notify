import { FunctionalComponent, h } from 'preact';
import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';
import { useCallback, useRef, useState } from 'preact/hooks';
import useLogin from '../../hooks/use-login';
import { useLoginState } from '../../hooks/use-loginstate';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

const Register: FunctionalComponent = () => {
    const dialogRef = useRef<Snackbar>();
    const isLoggedIn = useLoginState();
    const setLoginState = useLogin();
    const [loginFailed, setLoginFailed] = useState(false);
    const [doReload, setReload] = useState(false);

    const callback = useCallback(async (e: any) => {
        setLoginFailed(false);
        try {
            await setLoginState(e.target.checked);
            setReload(true)
        } catch (e: any) {
            dialogRef.current?.MDComponent.show({ message: `unable to register device error: ${e.message}`, timeout: 10000 });
            setLoginFailed(true);
        }
    }, [isLoggedIn, loginFailed]);

    return (
        <div>
            Subscribe to notifications <Switch onChange={callback} checked={isLoggedIn && !loginFailed} />           
            {doReload && <Button onClick={() => location.reload()}>reload please</Button>}
            <Snackbar ref={dialogRef} />
        </div>
    );
};

export default Register;