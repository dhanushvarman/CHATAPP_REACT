import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ChatBox from '../ChatPage/ChatBox';
import MyChats from '../ChatPage/MyChats';
import SideDrawer from '../ChatPage/SideDrawer';
import { ChatState } from '../../Context/Chatprovider';

function Chatpage() {

    const { user } = ChatState();
    const [fetchAgain,setfetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <div className='container-fluid'>
                {user && <MyChats fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
            </div>
        </div>
    )
}

export default Chatpage