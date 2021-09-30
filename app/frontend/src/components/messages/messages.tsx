import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { MessageType } from '../../types/messagetype';
import { PushMessage } from '../../types/postmassage';

import style from './messages.css';
import Message from '../message/message';
import 'preact-material-components/Theme/style.css';

const sortMessages = (messages: MessageType[]) => {
    return messages.sort((a, b) => b.receivedAt - a.receivedAt);
}

const Messages: FunctionalComponent = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        getOfflineDb().then(db => db.getAll('messages')).then(messages => sortMessages(messages)).then(setMessages).catch(console.warn);
        // todo set all messages to read
        const onMessageInternalCallback = (messageData: MessageEvent) => {
            const { data } = messageData as { data: PushMessage };
            if (data.type === 'notification') {
                setMessages(old => sortMessages([data.data, ...old]));
            }
        }        
        navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', onMessageInternalCallback);
        return () => navigator.serviceWorker && navigator.serviceWorker.removeEventListener('message', onMessageInternalCallback);
    }, []);

    return (<div>
        <ul class={style.messagelist}>
            {messages.map((message, index) => (
                <li class={style.nobullet}>
                    <Message message={message} />
                </li>)
            )}
        </ul>
    </div>)
}

export default Messages;