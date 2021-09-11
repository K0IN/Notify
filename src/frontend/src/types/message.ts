export interface Message {
    /* primaryKey*/ id: number; // created by the database 
    title: string;
    body: string;               // the message body
    icon: string;               // url to the icon

    receivedAt: Date;           // the date the message was received
    read: boolean;              // whether the message has been read
};