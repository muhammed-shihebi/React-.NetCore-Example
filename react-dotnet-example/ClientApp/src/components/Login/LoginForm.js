import React from 'react'



const LoginForm = ({ onChangeForm, submitUser, displayErrorMessage, isLogInForm, errorMessage, updateLogInFrom }) => {

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-7 mrgnbtm">
                    <h1>{isLogInForm ? "Login" : "Register"}</h1>
                    <form>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input type="Email" onChange={onChangeForm} className="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" required />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Password</label>
                                <input type="Password" onChange={onChangeForm} className="form-control" name="password" id="password" aria-describedby="emailHelp" placeholder="Password" required />
                            </div>
                        </div>
                        <button type="button" onClick={submitUser} className="btn btn-danger">{isLogInForm ? "Login" : "Register"}</button>
                        {displayErrorMessage ? <div>
                            <hr />
                            <p style={{ color: "red" }}> {errorMessage} </p>
                        </div> :
                            null}
                        <p style={{ marginTop:10, cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={updateLogInFrom}>{isLogInForm ? "Register" : "Login"}</p>

                    </form>
                </div>
            </div>
        </div>
    )
}
export default LoginForm;