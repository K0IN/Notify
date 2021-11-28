import { FunctionalComponent, h } from 'preact';

import Switch from 'preact-material-components/Switch';
import 'preact-material-components/Switch/style.css';
import Snackbar from 'preact-material-components/Snackbar';
import 'preact-material-components/Snackbar/style.css';
import { useCallback, useRef, useState } from 'preact/hooks';

import useLogin from '../../hooks/use-login';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';

import PasswordDialog from './dialog';



const Register: FunctionalComponent = () => {
    const snackbarRef = useRef<Snackbar>();

    const setLoginState = useLogin();

    const [isLoading, setLoading] = useState(false);
    const [isLoginFailed, setLoginFailed] = useState(false);
    const [showReloadButton, setShowReloadButton] = useState(false);
    const [showDialog, setDialog] = useState(false);

    const [apiKey, setApiKey] = useState<string | undefined>(undefined);

    const setLogin = useCallback((e: Event) => {        
        // try login
        // if login failed show snackbar
        // if login failed due to wrong password show dialog
        setDialog(!showDialog);
    }, [showDialog]);

    const onDialogExit = useCallback((e: string) => {
        // console.log("onDialogExit", e);
        setApiKey(e);
        setDialog(false);
    }, [showDialog]);

    return (
        <div>
            Subscribe to notifications <Switch onChange={setLogin} checked={false && !isLoginFailed} />            
            <div>{isLoading && "loading"}</div>           
            <PasswordDialog isOpened={showDialog} setPassword={onDialogExit} />
            {showReloadButton && <Button onClick={() => location.reload()}>reload please</Button>}
            <Snackbar ref={snackbarRef} />
        </div>
    );
};

export default Register;