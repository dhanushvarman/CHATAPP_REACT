import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { config } from '../../config';
import { getSender, getSenderFull } from '../../config/ChatLogic';
import { ChatState } from '../../Context/Chatprovider';
import ChatProfile from '../Modal/ChatProfile';
import Profile from '../Modal/Profile';
import UpdateGroupChat from '../Modal/UpdateGroupChat';
import ChatBox from './ChatBox';
import CreateGroupChat from './CreateGroupChat';

function MyChats({ fetchAgain, setfetchAgain }) {

  const [loggedUser, setLoggedUser] = useState();
  const [Loading, setLoading] = useState();

  const { user, selectedChat, setselectedChat, chats, setchats } = ChatState();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  const fetchChats = async () => {
    try {
      const auth = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      setLoading(true);
      const { data } = await axios.get(`${config.api}/chatApp/chat/chats`, auth);
      setchats(data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'>
          <div class="card">
            <div class="card-header" >
              MyChats
              <span className='createGroup'><button className='btn btn-secondary btn-sm' data-bs-toggle="modal" data-bs-target="#GroupChatModal"><i class="fa-solid fa-plus mr-2"></i>New Group Chat</button></span>
              <CreateGroupChat />
            </div>
            <div class="card-body searchResult" >
              {
                Loading ? <div class="text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                  :
                  chats.map((chat) => {
                    return <div class="card mt-1 ml-2" style={{ width: "19rem" }} key={chat._id}>
                      <ul class="list-group list-group-flush" style={{ marginLeft: "-20px" }}>

                        <li class="list-group-item" onClick={() => { setselectedChat(chat) }}
                          style={{ backgroundColor: selectedChat === chat ? "#38B2AC" : "", color: selectedChat === chat ? "white" : "", cursor: "pointer" }}>
                          <div className='conteiner'>
                            <div className='row'>
                              <div className='col-md-9' style={{ fontSize: "12px", fontWeight: "500" }}>
                                <div className='chatName'>
                                  {
                                    !chat.isGroupChat ? getSender(loggedUser, chat.users)
                                      :
                                      chat.chatName
                                  }
                                </div>
                                <div><b>{chat.latestMessage === undefined ? "" : chat.latestMessage.sender.name} : </b>{chat.latestMessage === undefined ? "" : chat.latestMessage.content}</div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  })
              }
            </div>
          </div>
        </div>
        <div className='col-md-8'>
          <div class="card">
            <div className='container mt-4' style={{ fontSize: "large", color: "GrayText" }}>
              {
                selectedChat === undefined ? ""
                  :
                  !selectedChat.isGroupChat ? <>
                    <div className='container' style={{ marginLeft: "-20px" }}>
                      <div className='row'>
                        <div className='col-md-4'>
                          <span>{getSender(user, selectedChat.users)}</span>
                        </div>
                        <div className='col-md-8'>
                          <button style={{ marginLeft: "400px" }} type="button" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#ChatProfile">
                            <i class="fa-regular fa-eye"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <ChatProfile user={getSenderFull(user, selectedChat.users)} />
                  </>
                    :
                    <>

                      <div className='container' style={{ marginLeft: "-20px" }}>
                        <div className='row'>
                          <div className='col-md-4'>
                            <span>{selectedChat.chatName.toUpperCase()}</span>
                          </div>
                          <div className='col-md-8'>
                            <button style={{ marginLeft: "400px" }} type="button" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#UpdateGroupChat">
                              <i class="fa-regular fa-eye"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <UpdateGroupChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
                    </>
              }
            </div>
            <div class="card-body" style={{ height: "500px" }}>
              <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyChats