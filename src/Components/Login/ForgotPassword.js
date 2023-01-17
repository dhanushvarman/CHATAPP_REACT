import axios from 'axios';
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { config } from '../../config';

function ForgotPassword() {

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [Error, setError] = useState("");

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validate: (values) => {
            let error = {};

            if (!values.email) {
                error.email = "Please enter a Email !!";
            }

            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email))) {
                error.email = "Please enter a Validate Email !!";
            }

            return error
        },
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setError();

                await axios.post(`${config.api}/chatApp/forgotPassword/forgot`, values);

                setLoading(false);
                setResponse("Email sent successfully");

            } catch (error) {
                setLoading(false);
                setResponse();
                setError(error.response.data.message);
                console.log(error);
            }
        }
    });


    return (
        <div class="container">

            <div class="row justify-content-center" style={{ width: "600px", marginLeft: "200px", marginTop: "50px" }}>

                <div class="col-xl-10 col-lg-12 col-md-9" >

                    <div class="card o-hidden border-0 shadow-lg my-5">
                        <div class="card-body p-0">
                            <div class="row">
                                <div class="col-lg">
                                    <div class="p-5">
                                        <div class="text-center">
                                            <h1 class="h4 text-gray-900 mb-2">Forgot Your Password?</h1>
                                            <p class="mb-4">We get it, stuff happens. Just enter your email address below
                                                and we'll send you a link to reset your password!</p>
                                        </div>
                                        <form class="user" onSubmit={formik.handleSubmit}>
                                            <div class="form-group">
                                                <input type="email"
                                                    name='email'
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    class="form-control form-control-user"
                                                    id="exampleInputEmail" aria-describedby="emailHelp"
                                                    placeholder="Enter Email Address..." />
                                                {
                                                    formik.errors.email ? <div style={{ color: "red", fontSize: "small" }}>{formik.errors.email}</div> : ""
                                                }
                                                {
                                                    response ? <div className='card mt-3 mb-3' style={{ backgroundColor: "lightgrey", color: "black", width: "380px" }}>
                                                        <div className='card-body text-center'>
                                                            <i class="fa-solid fa-circle-check mr-3" style={{ color: "green" }}></i>{response}
                                                        </div>
                                                    </div>
                                                        : ""
                                                }
                                                {
                                                    Error ? <div className='card mt-3 mb-3' style={{ backgroundColor: "lightgrey", color: "black", width: "380px" }}>
                                                        <div className='card-body text-center'>
                                                            <i class="fa-solid fa-circle-xmark mr-3" style={{ color: "red" }}></i>{Error}
                                                        </div>
                                                    </div>
                                                        : ""
                                                }
                                            </div>
                                            {
                                                loading ? <button class="btn btn-primary btn-user btn-block" type="button" disabled>
                                                    <span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </button>
                                                    :
                                                    <input class="btn btn-primary btn-user btn-block" type={"submit"} value="Reset Password" />
                                            }
                                        </form>
                                        <hr />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ForgotPassword