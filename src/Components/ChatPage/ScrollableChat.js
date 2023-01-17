import React, { useEffect } from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogic'
import { ChatState } from '../../Context/Chatprovider'

function ScrollableChat({ Messages, isTyping }) {

    const { user, selectedChat } = ChatState();

    useEffect(()=>{
        var scrollBottom = document.querySelector("#messagesBottom");
        scrollBottom.scrollTop = scrollBottom.scrollHeight;
    },[isTyping,Messages])

    return (
        <div className='messagesBottom' id='messagesBottom'>
            {
                Messages && Messages.map((m, i) => {
                    return <div style={{ display: "flex" }} key={m._id}>
                        {
                            (isSameSender(Messages, m, i, user._id) ||
                                isLastMessage(Messages, i, user._id)) && (<div>
                                    <img src={m.sender.image} className='rounded-circle' style={{ height: "30px", marginTop: "10px", marginLeft: "5px" }} />
                                </div>
                            )
                        }
                        <span style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "90%",
                            marginLeft: isSameSenderMargin(Messages, m, i, user._id),
                            marginTop: isSameUser(Messages, m, i, user._id) ? 3 : 10,
                        }}>
                            {m.content}
                        </span>
                    </div>
                })
            }
            {isTyping ? <div style={{ marginLeft: "10px", marginTop: "10px" }}>
                <div class="chat-bubble">
                    <div class="typing">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
                : <></>
            }
        </div>
    )
}

export default ScrollableChat