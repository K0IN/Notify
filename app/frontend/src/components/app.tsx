import { FunctionalComponent, h } from 'preact';
import { DatabaseProvider } from '../context/database';

import Messages from './messages/messages';
import Register from './register/register';

import style from './style.css';

const App: FunctionalComponent = () => (<div>
    <div class={style.content}>
        <div class={style.headeritem}>
            <Register />
        </div>
        <div class={style.main}>
            <DatabaseProvider>
                <Messages />
            </DatabaseProvider>
        </div>
    </div>
</div>);


export default App;
