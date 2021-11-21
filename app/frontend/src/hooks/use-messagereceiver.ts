import { useEffect, useState } from "preact/hooks";
import type { MessageType } from "../types/messagetype";
import type { PushMessage } from "../types/postmassage";
import { useDatabase } from "./use-database";

const sortMessages = (messages: MessageType[]): MessageType[] => {
    return messages.sort((a, b) => b.receivedAt - a.receivedAt);
}

export const useMessageReceiver = () => {
    const database = useDatabase();
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        database && database.getAll('messages').then(savedMessages => setMessages(sortMessages(savedMessages))).catch(console.warn);
    }, [database]);

    useEffect(() => {
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