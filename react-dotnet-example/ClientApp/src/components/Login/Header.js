import React from 'react';

function Header () {

    const headerStyle = {

        width: '100%',
        padding: '1%',
        backgroundColor: "black",
        color: 'black',
        textAlign: 'center'
    }

    return(
        <div style={headerStyle}>
            <h1 style={{ color: "white" }}>React + .Net App </h1>
        </div>
    )
}

export default Header; 