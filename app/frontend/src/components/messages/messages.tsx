import { FunctionalComponent, h } from 'preact';
import 'preact-material-components/Theme/style.css';
import { useLastOpenTime } from '../../hooks/use-lastopen';
import { useMessageReceiver } from '../../hooks/use-messagereceiver';
import Message from '../message/message';
import style from './messages.css';

const Messages: FunctionalComponent = () => {
    const messages = useMessageReceiver();
    const lastOpenTime = useLastOpenTime();
    console.log(messages, lastOpenTime, Date.now(), messages.filter(e => e.receivedAt > lastOpenTime));
    return (<div>
        <ul class={style.messagelist}>
            {messages.filter(e => !(e.receivedAt <= lastOpenTime)).map((message) => (
                <li class={style.nobullet}>
                    <Message message={message} />
                </li>)
            )}
        </ul>
        { messages.filter(e => e.receivedAt > lastOpenTime).length > 0
            && <div class={style.divider}></div>}
        <ul class={style.messagelist}>
            {messages.filter(e => e.receivedAt <= lastOpenTime).map((message) => (
                <li class={style.nobullet}>
                    <Message message={message} />
                </li>)
            )}
        </ul>
    </div>)
}

export default Messages;