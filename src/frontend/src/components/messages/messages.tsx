import { FunctionalComponent, h } from "preact";
import 'preact-material-components/Chips/style.css';
import List from 'preact-material-components/List';
import 'preact-material-components/List/style.css';
import { useEffect, useState } from "preact/hooks";
import { getOfflineDb } from "../../services/localdb";
import { MessageType } from "../../types/messagetype";
import { PushMessage } from "../../types/postmassage";
import Message from "../message/message";



const sortMessages = (messages: MessageType[]) => {
    return messages.sort((a, b) => {
        if (a.receivedAt > b.receivedAt) {
            return 1;
        }
        if (a.receivedAt < b.receivedAt) {
            return -1;
        }
        return 0;
    });
}

const Messages: FunctionalComponent = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        getOfflineDb().then(db => db.getAll('messages')).then(messages => setMessages(sortMessages(messages))).catch(console.warn);

        const onMessageInternalCallback = (messageData: MessageEvent) => {
            const { data } = messageData as { data: PushMessage };
            if (data.type === 'notification') {
                setMessages(old => sortMessages([data.data, ...old]));
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