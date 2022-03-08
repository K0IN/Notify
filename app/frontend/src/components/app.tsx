import { FunctionalComponent, h } from 'preact';
import { DatabaseProvider } from '../context/database';
import { useOnline } from '../hooks/use-offline';
import Messages from './messages/messages';
import OfflineBanner from './offlinebanner/offline';
import NotSupportedBanner from './notsupportedbanner/notsupported';
import Register from './register/register';
import style from './style.css';
import { useIsSupported } from '../hooks/use-supported';
import { useAppUpdate } from '../hooks/use-appupdate';
import HasUpdateBanner from './updatebanner/update';

const App: FunctionalComponent = () => {
    const hasUpdates = useAppUpdate();
    const isSupported = useIsSupported();
    const isOnline = useOnline();
    return (
        <div>
            {isSupported
                ? (<div class={style.content}>
                    <div class={style.headeritem}>
                        {hasUpdates && <HasUpdateBanner />}
                        {isOnline ? <Register /> : <OfflineBanner />}
                    </div>
                    <div class={style.main}>
                        <DatabaseProvider>
                            <Messages />
                        </DatabaseProvider>
                    </div>
                </div>)
                : <NotSupportedBanner />}
        </div>);
};


export default App;
