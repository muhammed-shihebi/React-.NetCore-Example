import React from "react";
import Button from "@material-ui/core/Button";

// AgGridReact
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

function BtnCellRenderer(props) {
    function handleDppClicked() {
        props.dppClicked(props.value); 
    }

    function handleAicClicked() {
        props.aicClicked(props.value);
    }

    return (
        <div>
            <Button variant="contained" onClick={handleDppClicked} style={{ marginRight: 10 }}> dpp </Button>
            <Button variant="contained" onClick={handleAicClicked}> aic </Button>
        </div>
    );
}

export default BtnCellRenderer;
