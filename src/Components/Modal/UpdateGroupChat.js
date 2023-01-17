import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { config } from '../../config';
import { ChatState } from '../../Context/Chatprovider'

function UpdateGroupChat({ fetchAgain, setfetchAgain }) {

    const { selectedChat, setselectedChat, user, Messages, setMessages } = ChatState();

    const [groupChatName, setgroupChatName] = useState();
    const [Search, setSearch] = useState("");
    const [searchResult, setsearchResult] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [renameLoading, setrenameLoading] = useState(false);
    const [Error, setError] = useState();

    const formik = useFormik({
        initialValues: {
            groupChatName: ""
        },
        validate: (values) => {
            let error = {};

            if (!values.groupChatName) {
                error.groupChatName = "Please enter a Group name";
            }

            return error
        },
        onSubmit: async (values) => {

            try {
                setrenameLoading(true);

                const auth = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.put(`${config.api}/chatApp/chat/renameGroup`, {
                    chatId: selectedChat._id,
                    chatName: values.groupChatName,
                },
                    auth);

                setselectedChat(data);
                setfetchAgain(!fetchAgain);
                setrenameLoading(false);

            } catch (error) {
                setrenameLoading(false);
                console.log(error);
            }
        }
    });

    const fetchMessages = async ()=>{
        if(!selectedChat){
          return
        }
    
        try {
          
          const auth = {
            headers : {
              Authorization : `Bearer ${user.token}`
            }
          }
    
          setLoading(true);
    
          const {data} = await axios.get(`${config.api}/chatApp/message/allMessages/${selectedChat._id}`,auth);
    
          setMessages(data);
          setLoading(false);
    
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };

    const handleSearch = async (query) => {

        setSearch(query);

        if (!query) {
            return
        }

        try {
            setLoading(true);

            const auth = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`${config.api}/chatApp/users/user?search=${Search}`, auth);
            setsearchResult(data);
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    };

    const handleAddUser = async (user1) => {

        if (selectedChat.users.find((u)=> u._id === user1._id)) {
            setError("User Already Exists !");
            return
        } 

        if(selectedChat.groupAdmin._id !== user._id){
            setError("Only admins can add someone !");
            return
        }

        try {
            setLoading(true);
            setError();
            const auth = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`${config.api}/chatApp/chat/addToGroup`,{
                chatId : selectedChat._id,
                userId : user1._id,
            },
            auth);

            setselectedChat(data);
            setfetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
        
    };

    const handleRemove = async (deleteUser) => {

        if(selectedChat.groupAdmin._id !== user._id && deleteUser._id !== user._id){
            setError("Only admins can add someone !");
            return
        }

        try {
            setError();
            setLoading(true);

            const auth = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put(`${config.api}/chatApp/chat/removeFromGroup`,{
                chatId : selectedChat._id,
                userId : deleteUser._id,
            },
            auth);

            deleteUser._id === user._id ? setselectedChat() : setselectedChat(data) ;

            setfetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <span>
            <div class="modal fade" id="UpdateGroupChat" tabIndex={"-1"} aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-8'>
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">{selectedChat.chatName}</h1>
                                    </div>
                                    <div className='col-md-4'>
                                        <button type="button" style={{ marginLeft: "100px" }} class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        {
                                            selectedChat.users.map((user) => {
                                                return <button key={user._id} type="button" class="btn btn-info btn-sm mr-2 mt-4" onClick={() => handleRemove(user)}>
                                                    {user.name} <i class="ml-1 fa-regular fa-circle-xmark"></i>
                                                </button>
                                            })
                                        }
                                    </div>
                                </div>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className='row mt-4'>
                                        <div className='col-md-9'>
                                            <input type={"text"}
                                                name='groupChatName'
                                                value={formik.values.groupChatName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className="form-control"
                                                placeholder="Enter Group Name..."
                                            />
                                            {
                                                formik.errors.groupChatName ? <span style={{ color: "red", fontSize: "small" }}>{formik.errors.groupChatName}</span> : ""
                                            }
                                        </div>
                                        <div className='col-md-2'>
                                            {
                                                renameLoading ? <button class="btn btn-success" type="button" disabled>
                                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                </button>
                                                    :
                                                    <input className='btn btn-success' type={"submit"} value="Update" />
                                            }
                                        </div>
                                    </div>
                                </form>
                                <form>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <input
                                                type={"text"}
                                                name="users"
                                                onChange={(e) => { handleSearch(e.target.value) }}
                                                className="form-control mt-3"
                                                placeholder='Add Users eg: John, Dhanush, Jane'
                                            />
                                        </div>
                                    </div>
                                </form>
                                {
                                    Error ?
                                        <div className='mb-2' style={{ color: "red", fontSize: "small" }}>{Error}</div>
                                        :
                                        ""
                                }
                                {
                                    Loading ?
                                        <div class="spinner-border text-secondary mt-3" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        :
                                        !searchResult ?
                                            ""
                                            :
                                            searchResult.slice(0, 3).map((user) => {
                                                return <div class="card mt-3 ml-2" style={{ width: "25rem" }} key={user._id}>
                                                    <ul class="list-group list-group-flush createGroupHover" onClick={() => handleAddUser(user)}>
                                                        <li class="list-group-item">
                                                            <div className='conteiner'>
                                                                <div className='row'>
                                                                    <div className='col-md-4'>
                                                                        <span><img className='searchProfile rounded-circle' src={user.image} /></span>
                                                                    </div>
                                                                    <div className='col-md-9' style={{ fontSize: "12px", marginLeft: "-40px", fontWeight: "500" }}>
                                                                        <div>{user.name}</div>
                                                                        <div><b>Email : </b>{user.email}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            })

                                }
                                <div className='row'>
                                    <div className='col-md-8'>

                                    </div>
                                    <div className='col-md-4 mt-3'>
                                        <button className='btn btn-danger' onClick={(() => { handleRemove(user) })}>Leave Group</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </span>
    )
}

export default UpdateGroupChat