import { FunctionalComponent, h } from 'preact';
import 'preact-material-components/Theme/style.css';
import { useEffect } from 'preact/hooks';
import Index from '../routes/index';


const App: FunctionalComponent = () => {
    useEffect(() => {
        if ((navigator as any).clearAppBadge) {
            (navigator as any).clearAppBadge().catch((error: Error) => console.warn(error));
        }
    }, []);

    return (
        <div id="preact_root">
            <Index />
        </div>
    );
};

export default App;
