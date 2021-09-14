import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Messages from '../../components/messages/messages';
import Register from '../../components/register/register';
import style from "./style.css";


const Index: FunctionalComponent = () => {
    const [isSubscribed, setSubscribed] = useState(false);

    useEffect(() => {
        setSubscribed(!!localStorage.userData);
        // todo ask the server(checkIfDeviceExists) if we are subscribed
    }, []);

    return (
        <div>
            <div class={style.content}>
                <div class={style.headeritem}>                        
                    <Register />
                </div>
                <div class={style.main}>
                    <Messages/>
                </div>
            </div>
        </div>
    );
};

export default Index;
