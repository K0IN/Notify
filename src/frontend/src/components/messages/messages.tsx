import { openDB } from "idb";
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { dbName, dbVersion } from "../../staticsettings";
import { MessageType } from "../../types/messagetype";

import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import { PushMessage } from "../../types/postmassage";
import Message from "../message/message";

import Chips from 'preact-material-components/Chips';
import 'preact-material-components/Chips/style.css';

const Messages: FunctionalComponent = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        // load all messages from the (offline) database
        openDB(dbName, dbVersion).then(db => db.getAll('messages')).then(messages => setMessages(messages)).catch(console.warn);

        const onMessageInternalCallback = (messageData: MessageEvent) => {
            const { data } = messageData as { data: PushMessage };
            if (data.type === 'notification') {
                setMessages(old => [data.data, ...old]);
            }
        }

        navigator.serviceWorker.addEventListener('message', onMessageInternalCallback);
        return () => navigator.serviceWorker.removeEventListener('message', onMessageInternalCallback);
    }, [messages]);

    return (<div>
        <List two-line={true} dense={false}>
            {messages.map((message, index) => (<Message message={message} />))}
        </List>
    </div>)
}

export default Messages;