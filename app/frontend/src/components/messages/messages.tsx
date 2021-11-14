import { FunctionalComponent, h } from 'preact';
import 'preact-material-components/Theme/style.css';
import { useMessageReceiver } from '../../hooks/use-messagereceiver';
import Message from '../message/message';
import style from './messages.css';

const Messages: FunctionalComponent = () => {
    const messages = useMessageReceiver();

    return (<div>
        <ul class={style.messagelist}>
            {messages.map((message) => (
                <li class={style.nobullet}>
                    <Message message={message} />
                </li>)
            )}
        </ul>
    </div>)
}

export default Messages;