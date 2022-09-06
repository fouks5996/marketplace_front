import React from 'react';
import ChatDetails from './ChatDetails';
import Chatlist from './Chatlist';

function Chat(props) {
    return (
        <div>
            <Chatlist/>
            <ChatDetails/>
        </div>
    );
}

export default Chat;