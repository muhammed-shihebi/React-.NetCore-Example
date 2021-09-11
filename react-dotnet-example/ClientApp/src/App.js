import "./custom.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import Home from "./Home";
import { Profile } from "./components/Pages/Profile";
import Order from "./components/Pages/Order";

function App(props) {

    const location = useLocation();
    var [currentUser, setCurrentUser] = useState(location.currentUser); 
    /*var updateCurrentUser = location.updateCurrentUser;*/

    function updateCurrentUser(newUser) {
        setCurrentUser(newUser); 
    }


    return (
        <Router>
            <Sidebar currentUser={currentUser} />
            <Switch>
                {/* <Route exact path="/App" render={() => {return (<Redirect to="/home" /> )}}/>*/}
                <Route path="/home" exact component={Home} />
                <Route path="/order" exact component={Order} />
                <Route path="/profile" exact render={(props) => <Profile {...props} currentUser={currentUser} updateCurrentUser={updateCurrentUser} />} />
            </Switch>
        </Router>
    );
}

export default App;