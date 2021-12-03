import { FunctionalComponent, h } from 'preact';
import { DatabaseProvider } from '../context/database';
import { useOnline } from '../hooks/use-offline';
import Messages from './messages/messages';
import OfflineBanner from './offlinebanner/offline';
import Register from './register/register';
import style from './style.css';

const App: FunctionalComponent = () => {
    const isOnline = useOnline();
    return (<div>
        <div class={style.content}>
            <div class={style.headeritem}>
                {isOnline ? <Register /> : <OfflineBanner />}
            </div>
            <div class={style.main}>
                <DatabaseProvider>
                    <Messages />
                </DatabaseProvider>
            </div>
        </div>
    </div>);
};


export default App;
