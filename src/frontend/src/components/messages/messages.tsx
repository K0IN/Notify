import { openDB } from "idb";
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { dbName, dbVersion } from "../../staticsettings";
import { Message as MessageData } from "../../types/message";

import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import { PushMessage } from "../../types/postmassage";

const Messages: FunctionalComponent = () => {
    const [messages, setMessages] = useState<MessageData[]>([]);
    useEffect(() => {
        openDB(dbName, dbVersion, {
            upgrade(db) {
                db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
            }
        });
    }, []);

    useEffect(() => {
        openDB(dbName, dbVersion).then(db => db.getAll('messages')).then(messages => setMessages(messages)).catch(console.warn)
    }, []);

    useEffect(() => {
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
        <List two-line={true}>
            {messages.map((message, index) => (
                <List.Item>
                    {message.title}: {message.body}
                </List.Item>))}
        </List>
    </div>)
}

export default Messages;