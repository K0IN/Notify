import { useEffect, useState } from "preact/hooks";
import { getOfflineDb } from "../services/messagedb";
import type { MessageType } from "../types/messagetype";
import type { PushMessage } from "../types/postmassage";

const sortMessages = (messages: MessageType[]): MessageType[] => {
    return messages.sort((a, b) => b.receivedAt - a.receivedAt);
}

export const useMessageReceiver = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    useEffect(() => {
        getOfflineDb().then(db => db.getAll('messages')).then(sortMessages).then(setMessages).catch(console.warn);
        
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

    return messages;
};