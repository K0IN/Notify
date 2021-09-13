import { openDB } from 'idb';
import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import { useEffect } from 'preact/hooks';
import Index from '../routes/index';
import { dbName, dbVersion } from '../staticsettings';
import OfflineWarning from './offlinebanner/offlinebanner';
import ServerWarning from './serverwarning/serverwarning';

import 'preact-material-components/Theme/style.css';

const App: FunctionalComponent = () => {
    useEffect(() => {
        openDB(dbName, dbVersion, {
            upgrade(db) {
                db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            }
        }).catch(error => console.warn(error));

        if((navigator as unknown).clearAppBadge) {
            navigator.clearAppBadge().catch(error => console.warn(error));
        }
    }, []);

    return (
        <div id="preact_root">
            <Router>
                <Route path="/" component={Index} default />
            </Router>
        </div>
    );
};

export default App;
