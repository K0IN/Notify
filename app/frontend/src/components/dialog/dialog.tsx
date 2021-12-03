import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import 'preact-material-components/Snackbar/style.css';
import 'preact-material-components/Button/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import Dialog from 'preact-material-components/Dialog';
import 'preact-material-components/Dialog/style.css';

type Props = {
    setPassword: (password: string | undefined) => void;
    isOpened: boolean;
};

const PasswordDialog: FunctionalComponent<Props> = ({ isOpened, setPassword }) => {
    const dialog = useRef<Dialog>();
    const [password, setPasswordValue] = useState('');

    useEffect(() => {
        setPasswordValue('');
        isOpened && dialog.current?.MDComponent.show();        
    }, [isOpened, dialog, setPasswordValue]);

    return (
        <div>
            <Dialog
                ref={dialog}
                onAccept={() => setPassword(password)}
                onCancel={() => setPassword(undefined)}>
                <Dialog.Header>Warning you need a Key to join this Notify instance</Dialog.Header>
                <Dialog.Body>
                    <TextField
                        type="password"
                        label="Enter login key"
                        value={password}
                        onInput={(e: any) => setPasswordValue(e.target.value)}
                    />
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.FooterButton cancel={true}>Abort</Dialog.FooterButton>
                    <Dialog.FooterButton accept={true}>Save</Dialog.FooterButton>
                </Dialog.Footer>
            </Dialog>
        </div>
    );
};

export default PasswordDialog;