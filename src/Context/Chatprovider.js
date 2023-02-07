import { createContext, useContext, useEffect, useState } from "react";

const chatContext = createContext();

const ChatProvider = ({children})=>{
    const[user,setUser] = useState();
    const [selectedChat, setselectedChat] = useState();
    const [chats, setchats] = useState([]);
    const [Messages,setMessages] = useState([]);
    const [Notification, setNotification] = useState([]);

    useEffect(() => {
        
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        setUser(userInfo);

    }, []);

    return (
        <chatContext.Provider value={{user , setUser,selectedChat, setselectedChat,chats, setchats, Messages, setMessages, Notification, setNotification}}>
            {children}
        </chatContext.Provider>
    )
    
}

export const ChatState = ()=>{
    return useContext(chatContext);
}

export default ChatProvider;