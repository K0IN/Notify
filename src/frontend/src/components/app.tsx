import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Index from '../routes/index';
import OfflineWarning from './offlinebanner/offlinebanner';
import ServerWarning from './serverwarning/serverwarning';

const App: FunctionalComponent = () => {

    return (
        <div id="preact_root">
            <ServerWarning />
            <OfflineWarning />
            <Router>
                <Route path="/" component={Index} default />
            </Router>
        </div>
    );
};

export default App;
