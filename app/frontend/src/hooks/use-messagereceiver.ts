import { useEffect, useState } from "preact/hooks";
import type { MessageType } from "../types/messagetype";
import type { PushMessage } from "../types/postmassage";
import { useDatabase } from "./use-database";
import { setAllMessagesAsRead } from "../database/message";
import type { NotifyDatabase } from "../types/dbtypes";

const sortMessages = (messages: MessageType[]): MessageType[] => {
    return messages.sort((a, b) => b.receivedAt - a.receivedAt);
}

export const useMessageReceiver = () => {
    const database = useDatabase();
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        database && database.getAll('messages').then(savedMessages => setMessages(sortMessages(savedMessages))).catch(console.warn);
        database && setAllMessagesAsRead(database as unknown as NotifyDatabase);
    }, [database, setMessages]);

    useEffect(() => {
        const onMessageInternalCallback = (messageData: MessageEvent) => {
            const { data } = messageData as { data: PushMessage };
            if (data.type === 'notification') {
                setMessages(old => sortMessages([data.data, ...old]));
            }
        }

        if (BroadcastChannel) {
            const bc = new BroadcastChannel('notify-channel');
            bc.addEventListener('message', onMessageInternalCallback);
            return () => bc.removeEventListener('message', onMessageInternalCallback);
        }

        navigator.serviceWorker && navigator.serviceWorker.addEventListener('message', onMessageInternalCallback);
        return () => navigator.serviceWorker && navigator.serviceWorker.removeEventListener('message', onMessageInternalCallback);
    }, [setMessages]);

    return messages;
};