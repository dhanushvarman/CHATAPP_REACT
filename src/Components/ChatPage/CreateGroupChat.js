import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { config } from '../../config';
import { ChatState } from '../../Context/Chatprovider';

function CreateGroupChat() {

    const [searchResult, setsearchResult] = useState();
    const [search, setsearch] = useState("");
    const [Loading, setLoading] = useState(false);
    const [selectedUser, setselectedUser] = useState([]);
    const [Error, setError] = useState();
    const [createGroup, setcreateGroup] = useState(false);
    const [response, setresponse] = useState();

    const { user, chats, setchats } = ChatState();

    const formik = useFormik({
        initialValues: {
            name: "",
            users: [],
        },
        validate: (values) => {
            let error = {};

            if (!values.name) {
                error.name = "Please provide a name for group";
            }
            if (values.users.length < 2) {
                error.users = "Please Select atleast two users to form group";
            }

            return error
        },
        onSubmit: async (values) => {
            try {
                setcreateGroup(true);

                const auth = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const userArray = JSON.stringify(values.users.map((u) => u._id));

                const { data } = await axios.post(`${config.api}/chatApp/chat/createGroup`, { name: values.name, users: userArray }, auth);

                setchats([data, ...chats]);
                setresponse("Group Created Successfully");

                setcreateGroup(false);

                formik.resetForm();

            } catch (error) {
                setresponse();
                setcreateGroup(false);
                console.log(error);
            }
        }
    })

    const handleSearch = async (query) => {

        setsearch(query);

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

            const { data } = await axios.get(`${config.api}/chatApp/users/user?search=${search}`, auth);
            setsearchResult(data);
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    };

    const handleGroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            setError("User Already Added");
        } else {
            setError();
            setselectedUser([...selectedUser, userToAdd]);
            formik.values.users = [...selectedUser, userToAdd];
        }

    };

    const handleDelete = (deleteUser) => {
        setselectedUser(selectedUser.filter((user) => user._id !== deleteUser._id));
        formik.values.users = selectedUser.filter((user) => user._id !== deleteUser._id);
    };

    return (
        <div class="modal fade" id="GroupChatModal" aria-hidden="true">
            <div class="modal-dialog" style={{ width: "400px" }}>
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Create Group Chat</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form onSubmit={formik.handleSubmit}>
                            <input
                                type={"text"}
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="form-control"
                                placeholder='Group Name...'
                            />
                            {
                                formik.errors.name ? <span style={{ color: "red", fontSize: "small" }}>{formik.errors.name}</span> : ""
                            }
                            <input
                                type={"text"}
                                name="users"
                                onChange={(e) => { handleSearch(e.target.value) }}
                                onBlur={formik.handleBlur}
                                className="form-control mt-3"
                                placeholder='Add Users eg: John, Dhanush, Jane'
                            />
                            {
                                formik.errors.users ? <div style={{ color: "red", fontSize: "small" }}>{formik.errors.users}</div> : ""
                            }
                            {
                                Error ?
                                    <div className='mb-2' style={{ color: "red", fontSize: "small" }}>{Error}</div>
                                    :
                                    ""
                            }
                            {
                                selectedUser.map((userAdded) => {
                                    return <button type="button" class="btn btn-info btn-sm mr-2 mt-2" onClick={() => handleDelete(userAdded)}>
                                        {userAdded.name} <i class="ml-1 fa-regular fa-circle-xmark"></i>
                                    </button>
                                })
                            }
                            {
                                Loading ?
                                    <div class="spinner-border text-secondary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    :
                                    !searchResult ?
                                        ""
                                        :
                                        searchResult.slice(0, 3).map((user) => {
                                            return <div class="card mt-3 ml-2" style={{ width: "22rem" }}>
                                                <ul class="list-group list-group-flush createGroupHover" onClick={() => handleGroup(user)}>
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
                            {
                                response ? <div className='card ml-5 mt-3' style={{ backgroundColor: "lightgrey", color: "black", width: "280px" }}>
                                    <div className='card-body text-center'>
                                        <i class="fa-solid fa-circle-check mr-3" style={{ color: "green" }}></i>{response}
                                    </div>
                                </div>
                                    : ""

                            }
                            {
                                createGroup ?
                                    <div class="d-grid gap-2 mt-4 d-md-flex justify-content-md-end">
                                        <button class="btn btn-success" type="button" disabled>
                                            <span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    </div>
                                    :
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end ">
                                        <input className='btn btn-success mt-4' type={"submit"} />
                                    </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupChat