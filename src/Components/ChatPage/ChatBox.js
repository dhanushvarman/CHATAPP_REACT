import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { config } from '../../config';
import { ChatState } from '../../Context/Chatprovider'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

const ENDPOINT = config.api;
var socket, selectedChatCompare;

function ChatBox({ fetchAgain, setfetchAgain}) {

  const { user, selectedChat, setselectedChat, Messages, setMessages, Notification, setNotification } = ChatState();

  const [Loading, setLoading] = useState(false);
  const [newMessage, setnewMessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const [Typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return
    }

    try {

      const auth = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      setLoading(true);

      const { data } = await axios.get(`${config.api}/chatApp/message/allMessages/${selectedChat._id}`, auth);

      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => setsocketConnected(true));
    socket.on('typing', () => setisTyping(true));
    socket.on('stop typing', () => setisTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if(!Notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved,...Notification]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...Messages, newMessageRecieved]);
      }
    })
  });

  const formik = useFormik({
    initialValues: {
      content: ""
    },
    onSubmit: async (values) => {
      try {
        socket.emit('stop typing', selectedChat._id);

        const auth = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        setnewMessage("");

        const { data } = await axios.post(`${config.api}/chatApp/message/sendMessage`, {
          content: newMessage,
          chatId: selectedChat._id,
        },
          auth
        );

        socket.emit('new message', data);

        setMessages([...Messages, data]);

      } catch (error) {
        console.log(error);
      }
    }
  })

  const typingHandler = (e) => {
    setnewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) {
      return
    }

    if (!Typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && Typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength)
  };

  return (
    <div className='chatBox'>
      {
        selectedChat ? <div>
          {
            Loading ? <div class="d-flex justify-content-center" style={{ marginTop: "200px" }}>
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
              :
              <>
                <div className='messages'>
                  <ScrollableChat Messages={Messages} isTyping={isTyping}/>
                </div>
              </>
          }
        </div>
          :
          <div className='message' style={{ backgroundColor: "white" }}>Click on a user to start chatting</div>
      }
      <div className='messageBox'>
        <form onSubmit={formik.handleSubmit}>
          <input className='form-control '
            name='content'
            onChange={typingHandler}
            value={newMessage}
            placeholder='Enter a message...'
          />
        </form>
      </div>
    </div>
  )
}

export default ChatBox