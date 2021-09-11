import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import Header from './components/Login/Header'
import LoginForm from './components/Login/LoginForm'
import { submitUser, registerNewUser } from './services/Service'
import { useHistory } from 'react-router-dom';
import validator from 'validator'; 


function Login() {

    const [currentUser, setCurrentUser] = useState({
        email: "",
        password: ""
    });

    function updateCurrentUser(newUser) {
        console.log("I got called", newUser);
        setCurrentUser(newUser); 
    }

    const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

    const [isLogInForm, setIsLogInForm] = useState(true);

    const [errorMessage, setErrorMessage] = useState("There was an error");

    let history = useHistory();


    function logInUser(event) {
        if (validator.isEmail(currentUser.email) && currentUser.password !== "") {
            if (isLogInForm) {
                submitUser(currentUser).then(response => {
                    if (response) { // the user is registered
                        history.push({ pathname: "/App", currentUser: currentUser, updateCurrentUser: updateCurrentUser });
                    } else { // the user is not registerd 
                        setErrorMessage("Password or Email were not correct"); 
                        setDisplayErrorMessage(true);
                        setInterval(updateDisplayErrorMessage, 20000);
                    }
                })
            } else {
                registerNewUser(currentUser).then(response => {
                    if (response) { // registration is correct
                        history.push({ pathname: "/App", currentUser: currentUser, updateCurrentUser: updateCurrentUser });
                    } else { // registration is not correct 
                        setErrorMessage("There is a user with this email");
                        setDisplayErrorMessage(true);
                        setInterval(updateDisplayErrorMessage, 20000);
                    }
                })
            }
        } else {
            setErrorMessage("Email or Password is not valid");
            setDisplayErrorMessage(true);
            setInterval(updateDisplayErrorMessage, 20000);
        }
    }

    function updateLogInFrom() {
        setIsLogInForm(!isLogInForm);
    }
    function updateDisplayErrorMessage() {
        setDisplayErrorMessage(false);
    }

    function onChangeForm(e) {
        const { name, value } = e.target;
        setCurrentUser(prevValue => {
            if (name === 'email') {
                return { password: prevValue.password, email: value }
            } else if (name === 'password') {
                return { password: value, email: prevValue.email }
            }
        });
    }

    return (
        <div className="App">
            <Header></Header>
            <div className="container mrgnbtm">
                <div className="row">
                    <div className="col-md-8">
                        <LoginForm
                            onChangeForm={onChangeForm}
                            submitUser={logInUser}
                            displayErrorMessage={displayErrorMessage}
                            isLogInForm={isLogInForm}
                            errorMessage={errorMessage}
                            updateLogInFrom={updateLogInFrom}
                        >
                        </LoginForm>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;