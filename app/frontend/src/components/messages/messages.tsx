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

    const newMessages = messages.filter(e => !(e.receivedAt <= lastOpenTime));
    const oldMessages = messages.filter(e => e.receivedAt <= lastOpenTime);

    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(10);

    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentNewMessages = newMessages.slice(indexOfFirstMessage, indexOfLastMessage);
    const currentOldMessages = oldMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    const totalPagesNew = Math.ceil(newMessages.length / messagesPerPage);
    const totalPagesOld = Math.ceil(oldMessages.length / messagesPerPage);

    const handleNextPage = () => {
        if (currentPage < Math.max(totalPagesNew, totalPagesOld)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
                    {currentNewMessages.map((message) => (
                        <li class={style.nobullet}>
                            <Message message={message} />
                        </li>
                    ))}
                </ul>

                {(newMessages.length > 0) && <div class={style.divider}></div>}

                <ul class={style.messagelist}>
                    {currentOldMessages.map((message) => (
                        <li class={style.nobullet}>
                            <Message message={message} />
                        </li>
                    ))}
                </ul>

                <div class={style.pagination}>
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage}</span>
                    <button onClick={handleNextPage} disabled={currentPage >= Math.max(totalPagesNew, totalPagesOld)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Messages;