import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router'
import { Modal, ModalHeader, ModalBody, Input, Label, Alert } from 'reactstrap';
import { getFormClient } from '../../services/constants';
import { post } from '../../services/axios';
import { AuthContext } from '../../helpers/auth/AuthContext';
import { server_domain } from '../../services/constants';

const SigninForm = (props) => {
    const { isShow, onClose, msg } = props

    const router = useRouter()

    const authContext = useContext(AuthContext)
    const onAuth = authContext.onAuth;
    const onAuthModalsTriggered = authContext.onAuthModalsTriggered
    const targetPath = authContext.targetPath

    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [isErr, setIsErr] = useState(false)
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const onFormChanged = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
    }

    const onSigninClicked = async () => {
        if (!form.email || !form.password) {
            setIsErr(true)
            setErrMsg("None-empty field is required.")
            return
        }

        let formData = getFormClient()
        formData.append('api_method', 'login')
        formData.append('login_email', form.email)
        formData.append('login_password', form.password)

        try {
            setLoading(true);
            const response = await post(server_domain, formData);
            if (response.data.message === "SUCCESS") {
                const user = response.data.data;
                const apiResponse = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: user })
                });

                if (apiResponse.ok) {
                    // setting authenticated user information into the state of _app component
                    onAuth(user, true)

                    // saving the user information into localstorage
                    localStorage.setItem("isAuthenticated", "done");
                    localStorage.setItem("user", JSON.stringify(user));

                    // closing modal
                    setForm({
                        email: "",
                        password: ""
                    })
                    onClose(!isShow)

                    let target = null
                    if (targetPath.pathname) {
                        target = {
                            pathname: `/${user.role}` + targetPath.pathname
                        }
                        if (targetPath.query) {
                            target = {...target, query:targetPath.query}
                        }
                    } else if (targetPath === "/dashboard") {
                        target = `/${user.role}` + targetPath
                    } else {
                        target = targetPath
                    }
                    router.push(target)
                }
            } else if (response.data.error) {
                alert(response.data.message)  
            }
        } catch (err) {
            alert(err.toString())
        }
        setLoading(false);
    }

    return (
        <Modal
            isOpen={isShow}
            toggle={() => onClose(!isShow)}
            className="modal-md"
            centered
        >
            <ModalHeader className="signFormHeader border-0 thick-green d-flex justify-content-center">
                Sign in
            </ModalHeader>
            <ModalBody className="py-4 px-4">
                <form>
                    {
                        isErr && 
                        <div className="mb-3">
                            <Alert color="danger" toggle={() => setIsErr(false)}>{ errMsg }</Alert>
                        </div>
                    }
                    {
                        msg && 
                        <div className="mb-3">
                            <Alert color="primary">{ msg }</Alert>
                        </div>
                    }
                    <div className="input-group mb-3 mt-2">
                        <input 
                            type="email" 
                            className="form-control" 
                            name="email" 
                            placeholder="Email*"
                            value={form.email}
                            onChange={onFormChanged}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <input 
                            type="password" 
                            className="form-control" 
                            name="password" 
                            placeholder="Password*"
                            value={form.password}
                            onChange={onFormChanged}
                        />
                    </div>
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <div className="form-check">
                            <Input className="form-check-input" type="checkbox" id="keep-signed" />
                            <Label className="form-check-label fs-sm" for="keep-signed">Keep me signed in</Label>
                        </div>
                        <a className="nav-link-style fs-ms signLink">Forgot password?</a>
                    </div>
                    <div className='d-flex justify-content-center mb-4'>
                        <button
                            type="button" 
                            className="btn btn-solid btn-default-plan btn-post btn-sm"
                            onClick={onSigninClicked}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sign In'}
                            {
                                loading &&
                                <span className="spinner-border spinner-border-sm"></span>
                            }    
                        </button>
                    </div>
                    <div>
                        Don't have an account? <a style={{ cursor: 'pointer', color: '#208cff' }} onClick={()=>onAuthModalsTriggered("user_type")}>Sign up</a>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default SigninForm