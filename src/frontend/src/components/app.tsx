import { FunctionalComponent, h } from 'preact';
import { useEffect } from 'preact/hooks';

import Messages from './messages/messages';
import Register from './register/register';

import style from './style.css';

const App: FunctionalComponent = () => {
    useEffect(() => {
        if ((navigator as any).clearAppBadge) {
            (navigator as any).clearAppBadge().catch(console.warn);
        }
    }, []);

    return (<div>
        <div class={style.content}>
            <div class={style.headeritem}>
                <Register />
            </div>
            <div class={style.main}>
                <Messages />
            </div>
        </div>
    </div>);

};

export default App;
