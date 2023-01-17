import axios from 'axios';
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../config';

function ResetPassword() {

    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [Error, setError] = useState("");

    const formik = useFormik({
        initialValues: {
            password: "",
            repeat: ""
        },
        validate: (values) => {

            let error = {};

            if (!values.password) {
                error.password = "Please enter a password";
            }

            if (!(values.password === values.repeat)) {
                error.repeat = "Password Mismatch";
            }

            return error
        },
        onSubmit: async (values) => {

            try {
                setError();
                setLoading(true);

                const auth = {
                    headers: {
                        Authorization: `Bearer ${params.token}`
                    }
                };

                delete values.repeat;

                await axios.put(`${config.api}/chatApp/forgotPassword/reset`,values ,auth);

                setLoading(false);
                alert("Password Reset Successfull");
                navigate('/');

            } catch (error) {
                setError(error.response.data.message);
                console.log(error);
                setLoading(false);
            }
        }
    });

    return (
        <div class="container">

            <div class="card o-hidden border-0 shadow-lg my-5" style={{ width: "400px", marginLeft: "300px", marginTop: "100px" }}>
                <div class="card-body p-0">
                    <div class="row">
                        <div class="col-lg">
                            <div class="p-5">
                                <div class="text-center">
                                    <h1 class="h4 text-gray-900 mb-4">Reset Password!</h1>
                                </div>
                                <form class="user" onSubmit={formik.handleSubmit}>
                                    <div class="form-group row">
                                        <div class="col-sm-12 mb-3 mb-sm-0">
                                            <input type="password"
                                                name='password'
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                class="form-control form-control-user"
                                                id="exampleInputPassword" placeholder="Password"
                                            />
                                            {
                                                formik.errors.password ? <div style={{ color: "red", fontSize: "small" }}>{formik.errors.password}</div> : ""
                                            }
                                        </div>
                                        <div class="col-sm-12 mt-3">
                                            <input type="password"
                                                name='repeat'
                                                value={formik.values.repeat}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                class="form-control form-control-user"
                                                id="exampleRepeatPassword" placeholder="Repeat Password"
                                            />
                                            {
                                                formik.errors.repeat ? <div style={{ color: "red", fontSize: "small" }}>{formik.errors.repeat}</div> : ""
                                            }
                                        </div>
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
                                            <input class="btn btn-primary btn-user btn-block" type={"submit"} value={"Reset Password"} />
                                    }
                                    <hr />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ResetPassword