import { FunctionalComponent, h } from "preact";
import { useEffect } from "preact/hooks";
import { getOfflineDb } from "../../services/localdb";
import { MessageType } from "../../types/messagetype";


type MessageProps = {
    message: MessageType;
}

const timeStampToString = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

const Message: FunctionalComponent<MessageProps> = ({ message }: MessageProps) => {

    useEffect(() => {
        if (!message.read) {
            message.read = true;
            getOfflineDb().then(db => db.put("messages", message));
        }
    }, []);

    // todo:
    // - add a delete button
    // - add a read status indicator
    // - add a better timestamp
    // - add a icon option

    return (
        <div>
            <h1> {message.title} - {timeStampToString(message.receivedAt)}</h1>
            <span>{message.body}</span>
        </div>)
}

export default Message;