import { FunctionalComponent, h } from "preact";
import { useEffect } from "preact/hooks";
import { getOfflineDb } from "../../services/localdb";
import { MessageType } from "../../types/messagetype";

import Chips from 'preact-material-components/Chips';
import 'preact-material-components/Chips/style.css';
import 'preact-material-components/Theme/style.css';

import Elevation from 'preact-material-components/Elevation';
import 'preact-material-components/Elevation/style.css';

import style from "./message.css";

type MessageProps = {
    message: MessageType;
}

const timeStampToString = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

const Message: FunctionalComponent<MessageProps> = ({ message }: MessageProps) => {

    // todo:
    // - add a delete button
    // - add a read status indicator
    // - add a better timestamp
    // - add a icon option

    return (
        <div>
            <Elevation z={1}>
                <h1>{message.title}</h1>
                <p>{timeStampToString(message.receivedAt)}</p>
                <div class={style.messagebody}>{message.body}</div>
                <Chips>
                    {message.tags.map((tag: string) => (<Chips.Chip>{tag as any}</Chips.Chip>) as any)}
                </Chips>
            </Elevation>
        </div>)
}

export default Message;