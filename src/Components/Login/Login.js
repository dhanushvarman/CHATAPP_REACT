import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { config } from '../../config';
import '../Login/login.css';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [panel, setPanel] = useState();
    const [show, setShow] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [response, setResponse] = useState();
    const [error, seterror] = useState();
    const [loginError, setLoginError] = useState();
    const toast = useToast();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: (values) => {

            let error = {};

            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email))) {
                error.email = "Please enter email..."
            }
            if (!values.password) {
                error.password = "Please Enter a Password...";
            }

            return error
        },
        onSubmit: async (values) => {
            try {
                setImageLoading(true);
                const data = await axios.post(`${config.api}/chatApp/users/login`, values);
                setImageLoading(false);
                setLoginError();
                localStorage.setItem("userInfo", JSON.stringify(data.data));
                navigate('/chats');
            } catch (error) {
                console.log(error);
                setImageLoading(false);
                setLoginError(error.response.data.message);
            }
        }
    });

    const formik1 = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirm: "",
            image: "",
        },
        validate: (values) => {

            let error = {};

            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email))) {
                error.email = "Please enter email..."
            }
            if (!values.password) {
                error.password = "Please Enter a Password...";
            }
            if (!values.name) {
                error.name = "Please Enter a name..."
            }
            if (!(values.confirm === values.password)) {
                error.confirm = "Password Doesn't Match..."
            }

            return error
        },
        onSubmit: async (values) => {
            try {
                delete values.confirm;
                setImageLoading(true);
                const data = await axios.post(`${config.api}/chatApp/users/register`, values);
                setImageLoading(false);
                seterror();
                setResponse(data.data.message);
                localStorage.setItem("userInfo", JSON.stringify(data.data));
                formik1.resetForm();
            } catch (error) {
                console.log(error);
                setImageLoading(false);
                setResponse();
                seterror(error.response.data.message);
            }
        }
    });

    function view() {
        setShow(!show);
    }

    function guest() {
        formik.setValues({ email: "guest@example.com", password: "123456" });
    }

    function imagePost(pic) {
        if (pic === undefined) {
            toast({
                title: 'Please Select an image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            setImageLoading(true);
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chatApp");
            data.append("cloud_name", "dyk9a0gnb");
            fetch("https://api.cloudinary.com/v1_1/dyk9a0gnb/image/upload", {
                method: 'post',
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    formik1.values.image = data.url;
                    console.log(data.url.toString());
                    setImageLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setImageLoading(false);
                });
        } else {
            toast({
                title: 'Please Select an image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setImageLoading(false);
            return;
        }

    }

    return (
        <div className='login-page'>
            <div class={`login-container ${panel}`} id="login-container">
                <div class="form-container sign-up-container">
                    <form onSubmit={formik1.handleSubmit} className="login-form">
                        <h1 className='login-heading'>Create Account</h1>
                        <input className='mt-4 login-input' type="text"
                            name='name'
                            value={formik1.values.name}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            placeholder="Name" />
                        {
                            formik1.errors.name ? <span className='error-box'>{formik1.errors.name}</span> : ""
                        }
                        <input type="email"
                            className='login-input'
                            name='email'
                            value={formik1.values.email}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            placeholder="Email" />
                        {
                            formik1.errors.email ? <span className='error-box'>{formik1.errors.email}</span> : ""
                        }
                        <input type="password"
                            className='login-input'
                            name='password'
                            value={formik1.values.password}
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            placeholder="Password" />
                        {
                            formik1.errors.password ? <span className='error-box' style={{ marginLeft: "-120px" }}>{formik1.errors.password}</span> : ""
                        }
                        <div className='input-icons'>
                            <i class={show ? "fa-regular fa-eye icons" : "fa-regular fa-eye-slash icons"} onClick={view}></i>
                            <input type={show ? "text" : "password"}
                                name='confirm'
                                value={formik1.values.confirm}
                                onChange={formik1.handleChange}
                                onBlur={formik1.handleBlur}
                                placeholder="Confirm Password" className='form-control login-input' />
                        </div>
                        {
                            formik1.errors.confirm ? <span className='error-box' style={{ marginLeft: "-110px" }}>{formik1.errors.confirm}</span> : ""
                        }
                        <div>
                            <input type={"file"}
                                className="login-input"
                                p={1.5}
                                accept="image/*"
                                name='image'
                                onChange={(e) => imagePost(e.target.files[0])}
                                onBlur={formik1.handleBlur}
                            />
                        </div>
                        {
                            error ? <div className='card mb-3' style={{ backgroundColor: "lightgrey", color: "black", width: "280px" }}>
                                <div className='card-body text-center'>
                                    <i class="fa-solid fa-circle-xmark mr-3" style={{ color: "red" }}></i>{error}
                                </div>
                            </div>
                                : ""

                        }
                        {
                            response ? <div className='card mb-3' style={{ backgroundColor: "lightgrey", color: "black", width: "280px" }}>
                                <div className='card-body text-center'>
                                    <i class="fa-solid fa-circle-check mr-3" style={{ color: "green" }}></i>{response}
                                </div>
                            </div>
                                : ""
                        }
                        {
                            imageLoading ?
                                <button class="btn btn-primary" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" style={{ marginRight: "10px" }} role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                                :
                                <button type='submit' className='mt-3 login-button' >Sign Up</button>
                        }
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form onSubmit={formik.handleSubmit} className="login-form">
                        <h1 className='login-heading'>Sign in</h1>
                        <input type="email"
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Email" className='form-control mb-3 mt-4 login-input' />
                        {
                            formik.errors.email ? <span className='error-box'>{formik.errors.email}</span> : ""
                        }
                        <div className='input-icons'>
                            <i class={show ? "fa-regular fa-eye icons" : "fa-regular fa-eye-slash icons"} onClick={view}></i>
                            <input type={show ? "text" : "password"}
                                name='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Password" className='form-control login-input' />

                        </div>

                        {
                            formik.errors.password ? <span className='error-box' style={{ marginTop: "3px", marginLeft: "-110px" }}>{formik.errors.password}</span> : ""
                        }
                        {
                            loginError ? <div className='card mb-3' style={{ backgroundColor: "lightgrey", color: "black", width: "280px", marginTop: "20px" }}>
                                <div className='card-body text-center'>
                                    <i class="fa-solid fa-circle-xmark mr-3" style={{ color: "red" }}></i>{loginError}
                                </div>
                            </div>
                                : ""

                        }
                        {
                            imageLoading ?
                                <button class="btn btn-primary login-button" type="button" disabled>
                                    <span class="spinner-border spinner-border-sm" style={{ marginRight: "10px" }} role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                                :
                                <button type='submit' className='mt-3 login-button' style={{ width: "170px" }}>Login</button>
                        }
                        <input type='button' className='mt-3 guest' style={{ height: "45px" }} value={"Guest User"} onClick={guest} />
                        <div class="text-center mt-3">
                            <a class="small" style={{cursor:"pointer"}} onClick={()=>navigate('/forgot-password')}>Forgot Password?</a>
                        </div>
                    </form>
                    <hr />

                </div>
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1 className='login-heading'>Welcome Back!</h1>
                            <p className='login-para'>To keep connected with us please login with your personal info</p>
                            <button class="ghost login-button" id="signIn" onClick={() => { setPanel("") }}>Sign In</button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1 className='login-heading'>Hello, Friend!</h1>
                            <p className='login-para'>Enter your personal details and start journey with us</p>
                            <button className='ghost login-button' id="signUp" onClick={() => { setPanel("right-panel-active") }}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login