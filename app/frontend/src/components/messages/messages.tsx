import { FunctionalComponent, h } from 'preact';
import 'preact-material-components/Theme/style.css';
import { useLastOpenTime } from '../../hooks/use-lastopen';
import { useMessageReceiver } from '../../hooks/use-messagereceiver';
import Message from '../message/message';
import style from './messages.css';
import { useEffect, useState } from 'preact/hooks';

const Messages: FunctionalComponent = () => {
    const messages = useMessageReceiver();
    const lastOpenTime = useLastOpenTime();
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage, setMessagesPerPage] = useState(10);

    const newMessages = messages.filter(e => !(e.receivedAt <= lastOpenTime));
    const oldMessages = messages.filter(e => e.receivedAt <= lastOpenTime);

    const paginatedMessages = (messages) => {
        const startIndex = (currentPage - 1) * messagesPerPage;
        const endIndex = startIndex + messagesPerPage;
        return messages.slice(startIndex, endIndex);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    useEffect(() => {
        if (navigator && (navigator as any).clearAppBadge) {
            (navigator as any).clearAppBadge();
        }
    }, [messages]);

    return (
        <div class={style.content}>
            <div class={style.main}>
                <ul class={style.messagelist}>
                    {paginatedMessages(newMessages).map((message) => (
                        <li class={style.nobullet}>
                            <Message message={message} />
                        </li>
                    ))}
                </ul>

                {(newMessages.length > 0) && <div class={style.divider}></div>}

                <ul class={style.messagelist}>
                    {paginatedMessages(oldMessages).map((message) => (
                        <li class={style.nobullet}>
                            <Message message={message} />
                        </li>
                    ))}
                </ul>

                <div class={style.paginationControls}>
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage}</span>
                    <button onClick={handleNextPage} disabled={(currentPage * messagesPerPage) >= messages.length}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Messages;