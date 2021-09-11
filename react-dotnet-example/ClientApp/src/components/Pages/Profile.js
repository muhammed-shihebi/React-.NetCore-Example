import React, { useState } from 'react';
import validator from 'validator';
import { updateUser } from '../../services/Service';


export function Profile(props) {
    var currentUser = props.currentUser;
    var updateCurrentUser = props.updateCurrentUser;

    const [tempCurrentUser, setTempCurrentUser] = useState({
        email: currentUser.email,
        password: currentUser.password
    })

    const [errorMessage, setErrorMessage] = useState("");

    const [successMessage, setSuccessMessage] = useState(""); 

    function onChangeForm(e) {
        const { name, value } = e.target;
        setTempCurrentUser(prevValue => {
            if (name === 'email') {
                return { password: prevValue.password, email: value }
            } else if (name === 'password') {
                return { password: value, email: prevValue.email }
            }
        });
    }

    function submitUpdate() {
        if (validator.isEmail(tempCurrentUser.email) && tempCurrentUser.password !== "") {

            var users = {
                oldUser: {
                    email: currentUser.email,
                    password: currentUser.password
                },
                newUser: {
                    email: tempCurrentUser.email,
                    password: tempCurrentUser.password
                }
            }

            updateUser(users).then(response => {
                if (response) { // users data have been updated
                    updateCurrentUser(tempCurrentUser); 
                    setSuccessMessage("Success");
                    setInterval(() => { return setSuccessMessage("") }, 2000);

                } else { // users data were not updated
                    setErrorMessage("Email is used by other user");
                    setInterval(() => { return setErrorMessage("") }, 2000);
                }
            })
        } else {
            setErrorMessage("Email or Password is not valid");
            setInterval(() => { return setErrorMessage("") }, 2000);
        }
    }

    return (
        <div className="home">
            <h1>Update User Inforamtion </h1>
            <div >
                <div className="row">
                    <div className="col-md-5 mrgnbtm">
                        <form>
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="exampleInputEmail1">New Email</label>
                                    <input type="Email" onChange={onChangeForm} className="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder={currentUser.email} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="exampleInputEmail1">New Password</label>
                                    <input type="Password" onChange={onChangeForm} className="form-control" name="password" id="password" aria-describedby="emailHelp" placeholder={currentUser.password} required />
                                </div>
                            </div>
                            <button type="button" onClick={submitUpdate} className="btn btn-primary">Update</button>
                            {errorMessage !== "" ? <div>
                                <hr />
                                <p style={{ color: "red" }}> {errorMessage} </p>
                            </div> :
                                null}

                            {successMessage !== "" ? <div>
                                <hr />
                                <p style={{ color: "green" }}> {successMessage} </p>
                            </div> :
                                null}
                        </form>
                    </div>
                </div>
            </div>


        </div>
    );
};
