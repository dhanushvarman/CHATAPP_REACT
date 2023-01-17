import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { config } from '../../config';
import { ChatState } from '../../Context/Chatprovider';

function Sidebar({ user }) {

    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);

    const { setselectedChat, chats, setchats } = ChatState();

    const formik = useFormik({
        initialValues: {
            search: ""
        },
        validate: (values) => {
            let error = {};

            if (!values.search) {
                error.search = "Search box is empty !!";
            }

            return error
        },
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const auth = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.get(`${config.api}/chatApp/users/user?search=${values.search}`, auth);
                setLoading(false);
                setSearchResult(data);

            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
    });

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const auth = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.post(`${config.api}/chatApp/chat/create`, {userId}, auth);

            if(!chats.find((c)=> c._id === data._id)){
                setchats([data,...chats]);
            }

            setselectedChat(data);
            setLoadingChat(false);

            document.getElementById("mySidenav").style.width = "0px";

        } catch (error) {
            setLoadingChat(false);
            console.log(error);
        }
    };

    return (
        <div id="mySidenav" class="sidenav">
            <form class="d-flex mt-4" onSubmit={formik.handleSubmit} >
                <input name='search' value={formik.values.search} onChange={formik.handleChange} class="form-control me-2 ml-2 search-box" type="text" placeholder="Search by name" />
                {
                    loading ? <button class="btn btn-success btn-sm" type="button" disabled>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="visually-hidden">Loading...</span>
                    </button>
                        :
                        <button class="btn btn-success btn-sm" type="submit">Go</button>
                }
            </form>
            {
                formik.errors.search ? <span style={{ color: "red", fontSize: "13px", paddingLeft: "10px" }}>{formik.errors.search}</span> : ""
            }
            {
                searchResult.map((user) => {
                    return <div class="card mt-2 ml-2" style={{ width: "17rem" }} key={user._id}>
                    <ul class="list-group list-group-flush">
                    
                        <li class="list-group-item hover" style={{backgroundColor:"#e0e0e0"}} onClick={() => { accessChat(user._id) }} >
                            <div className='conteiner'>
                                <div className='row'>
                                        <div className='col-md-4'>
                                            <span><img className='searchProfile rounded-circle' src={user.image} /></span>
                                        </div>
                                        <div className='col-md-9' style={{ fontSize: "12px", marginLeft: "-40px", fontWeight: "500" }}>
                                            <div>{user.name}</div>
                                            <div>{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                        </li>
                    </ul>
                </div>
                
                })
            }
            {
                loadingChat ? <div class="clearfix mt-3 mr-4">
                <div class="spinner-border float-end" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
                :
                ""
            }
        </div>
    )
}

export default Sidebar