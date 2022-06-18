export interface MessageType {
    /* primaryKey*/ id?: number; // created by the database 
    title: string;              // title of the message
    body: string;               // the message body
    icon: string;               // url to the icon
    tags: string[];             // array of tags
    receivedAt: number;         // the date the message was received
    read: boolean;              // whether the message has been read or not 
};