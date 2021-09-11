import "./custom.css";
import React, { useState } from 'react';
import { getOrgaData, getInjectionUnitNames, getDppData, getAicData, getDataDB, saveSmallData, uploadCentralData, getExcelFilesFromDB } from './services/Service'
import Select from 'react-select'
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";

// AgGridReact
import { AgGridReact, AgGridColumn } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


// Date Pickers 
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { formatDate } from "./utils";

// Button in Cell 
import BtnCellRenderer from "./components/BtnCellRenderer.jsx";


// Checkbox select 
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import SelectMUI from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { DataGrid } from "@material-ui/data-grid";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles({
    excelFileGrid: {
        '& .super-app.red': {
            color: 'red',
        },
        '& .super-app.green': {
            color: 'green',
        }
    }
});


// =========================================================== Consts 

const DPPDATATYPE = 0;
const AICDATATYPE = 1;

const FILEERROR = 1;
const FILENOERROR = 0;



function Home() {
    const classes = useStyles();

    // ===========================================================  Organisation
    const [organisations, setOrganisations] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [organisation, setOrganisation] = useState({
        label: "Name",
        value: "Id",
        status: "Status",
        ETSCode: "ETSOCode",
        shortName: "ShortName"
    });

    // fetch the data of the orgas
    function fetchData() {
        getOrgaData().then(response => {
            var orgas = response.body.organizations.map(function (organization) {
                return {
                    label: organization.organizationName,
                    value: organization.organizationId,
                    status: organization.organizationStatus,
                    ETSCode: organization.organizationETSOCode,
                    shortName: organization.organizationShortName
                }
            })
            setOrganisations(orgas);
            setIsDataLoaded(true);
        })
    }

    // Change the orga that is displayed and get its EIC 
    function updateOrga(opt) {
        var etscode = { value: opt.ETSCode };
        setOrganisation(opt)
        getInjectionUnitNames(etscode).then(response => {
            setETSCodeData(response.body.injectionUnitNames);
        })
    }

    // =========================================================== ETSCodeData
    const [ETSCodeData, setETSCodeData] = useState([]);

    const ETCodeGrid = {
        columnDefs: [
            {
                headerName: '',
                field: 'id',
                cellRenderer: 'btnCellRenderer',
                cellRendererParams: {
                    dppClicked: handleDppClicked,
                    aicClicked: handleAicClicked
                },

            },
            { headerName: "Name", field: 'name', sortable: true, filter: true },
            { headerName: "EIC", field: 'eic', sortable: true, filter: true }
        ],
        frameworkComponents: {
            btnCellRenderer: BtnCellRenderer
        },
        defaultColDef: {
            flex: 1,
            minWidth: 200
        },
        defaultRowDef: {
            minHeight: 250
        }
    }

    // =========================================================== dpp
    var [dppStartDate, setDppStartDate] = useState(new Date());
    var [dppEndDate, setDppEndDate] = useState(new Date());
    var [dppSelectedId, setDppSelectedId] = useState();
    const [dppData, setDppData] = useState([]);
    const [dppPopoverOpen, setDppPopoverOpen] = useState(false);
    const [dppGridApi, setDppGridApi] = useState(null);

    // to parce the numbers after editing them in the dpp and aic grids 
    function numberParser(params) {
        return Number(params.newValue);
    }

    const [gridColumnsDiffs, setGridColumnsDiffs] = useState([
        { hide: false, field: 'tarih', sortable: true, filter: true },
        { hide: false, field: 'saat', sortable: true, filter: true },
        { hide: false, field: 'toplam', sortable: true, filter: true, cellStyle: cellStyle },
        { hide: false, field: 'dogalgaz', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'ruzgar', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'linyit', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'tasKomur', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'ithalKomur', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'fuelOil', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'jeotermal', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'barajli', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'nafta', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'biokutle', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'akarsu', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
        { hide: false, field: 'diger', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle }
    ])

    var defaultColDef = {
        flex: 1,
        minWidth: 150
    }


    // to get the Dpp Grid Api to use it to control the cells 
    const onDppGridReady = (params) => {
        setDppGridApi(params.api);
    }

    // handle button dpp cliced 
    function handleDppClicked(selectedId) {
        setDppSelectedId(selectedId);
        setDppPopoverOpen(!dppPopoverOpen);
        setFieldNames(constFieldsNames);
        getExcelFiles(selectedId, DPPDATATYPE);
    }

    // handle closing the popover
    function handleDppPopoverClose() {
        setDppData([])
        setDppPopoverOpen(false);
    }

    // Get the data from Service 
    function handleDppServiceClicked() {
        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === dppSelectedId })[0]
        var dppParams = {
            EIC: ETSCodeSelectedRow.eic,
            ETSCode: organisation.ETSCode,
            stardDate: formatDate(dppStartDate),
            endDate: formatDate(dppEndDate)
        }
        getDppData(dppParams).then(response => {
            var dppList = response.body.dppList;
            /* dppList = dppList.map(dppItem => { return{ ...dppItem, tarih: dppItem.tarih.split('T')[0] }} */
            setDppData(dppList);
        })
    }

    // =========================================================== Aic

    var [aicStartDate, setAicStartDate] = useState(new Date());
    var [aicEndDate, setAicEndDate] = useState(new Date());
    var [aicSelectedId, setAicSelectedId] = useState();
    const [aicData, setAicData] = useState([]);
    const [aicPopoverOpen, setAicPopoverOpen] = useState(false);

    const [aicGridApi, setAicGridApi] = useState(null);

    const [aicGridColumnsDiffs, setAicGridColumnsDiffs] = useState(
        [
            { hide: false, field: 'tarih', sortable: true, filter: true, minWidth: 200 },
            { hide: false, field: 'toplam', sortable: true, filter: true, cellStyle: cellStyle },
            { hide: false, field: 'dogalgaz', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'ruzgar', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'linyit', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'tasKomur', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'ithalKomur', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'fuelOil', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'jeotermal', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'barajli', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'nafta', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'biokutle', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'akarsu', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle },
            { hide: false, field: 'diger', sortable: true, filter: true, editable: true, valueParser: numberParser, cellStyle: cellStyle }
        ]
    )

    function cellStyle(params) {
        var color = numberToColor(params.value);
        return { backgroundColor: color };
    }

    function numberToColor(val) {
        if (val === 0) {
            return '#ffaaaa';
        } else if (val === 1) {
            return '#aaaaff';
        } else {
            return '#aaffaa';
        }
    }

    // to get the Aic Grid Api to use it to control the cells 
    const onAicGridReady = (params) => {
        setAicGridApi(params.api);
    }

    // handle Aic Button Clicked 
    function handleAicClicked(selectedId) {
        setAicSelectedId(selectedId);
        setAicPopoverOpen(!aicPopoverOpen);
        setFieldNames(constFieldsNames);
        getExcelFiles(selectedId, AICDATATYPE);
    }

    // Hnadle closing Aic Popover 
    function handleAicPopoverClose() {
        setAicData([]);
        setAicPopoverOpen(false);
    }

    // Get Aic data from Service
    function handleAicServiceClicked() {
        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === aicSelectedId })[0]
        var aicParams = {
            EIC: ETSCodeSelectedRow.eic,
            ETSCode: organisation.ETSCode,
            stardDate: formatDate(aicStartDate),
            endDate: formatDate(aicEndDate)
        }
        getAicData(aicParams).then(response => {
            var aicList = response.body.aicList;
            setAicData(aicList);
        })
    }

    // =========================================================== DPP Database 

    const [displaySuccessMessage, setdisplaySuccessMessage] = useState(false);
    const [displayErrorMessage, setdisplayErrorMessage] = useState(false);

    // Get all the Data in Dpp Grid 
    function getAllDppRows() {
        if (dppGridApi) {
            dppGridApi.stopEditing();
            let rowData = [];
            dppGridApi.forEachNode(node => rowData.push(node.data));
            return rowData;
        }
    }

    // to calculate the Toplam after editing a cell 
    function onDppCellValueChanged(event) {
        if (event.colDef.field !== 'toplam') {
            var rowNode = dppGridApi.getRowNode(event.node.id);
            var oldToplam = event.data.toplam;
            var newToplam = (oldToplam - event.oldValue) + event.value;
            rowNode.setDataValue('toplam', newToplam);
        }
    }

    function handleDppDatabaseClicked() {
        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === dppSelectedId })[0]
        var dppParams = {
            EIC: ETSCodeSelectedRow.eic,
            ETSCode: organisation.ETSCode,
            stardDate: formatDate(dppStartDate),
            endDate: formatDate(dppEndDate),
            dataType: DPPDATATYPE
        }
        getDataDB(dppParams).then(response => {
            setDppData(response);
        })
    }

    function handleDppSvToDBClicked2() {
        var data = getAllDppRows();
        var allFieldsNames = fieldNames.concat(eFields);
        if (data !== undefined && data.length > 0) {
            var smallData = data.map(element => {
                var changedData = {};

                allFieldsNames.forEach(fieldName => {
                    changedData[fieldName] = element[fieldName];
                });
                return changedData;
            });

            var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === dppSelectedId })[0]
            var dataToSave = {
                EIC: ETSCodeSelectedRow.eic,
                ETSCode: organisation.ETSCode,
                Data: smallData,
                DataType: DPPDATATYPE,
                FieldsNames: allFieldsNames
            }
            saveSmallData(dataToSave).then(response => {
                setdisplaySuccessMessage(true);
                setdisplayErrorMessage(false);
                resetMessages();
            })
        } else {
            setdisplaySuccessMessage(false);
            setdisplayErrorMessage(true);
            resetMessages();
        }

    }


    function resetMessages() {
        setInterval(function () { setdisplaySuccessMessage(false); }, 2000);
        setInterval(function () { setdisplayErrorMessage(false); }, 2000);
    }

    // =========================================================== AIC Database 


    // Get all the Data in Aic Grid 
    function getAllAicRows() {
        if (aicGridApi) {
            aicGridApi.stopEditing();
            let rowData = [];
            aicGridApi.forEachNode(node => rowData.push(node.data));
            return rowData;
        }
    }

    // to calculate the Toplam after editing a cell 
    function onAicCellValueChanged(event) {
        if (event.colDef.field !== 'toplam') {
            var rowNode = aicGridApi.getRowNode(event.node.id);
            var oldToplam = event.data.toplam;
            var newToplam = (oldToplam - event.oldValue) + event.value;
            rowNode.setDataValue('toplam', newToplam);
        }
    }

    function handleAicDatabaseClicked() {

        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === aicSelectedId })[0]
        var aicParams = {
            EIC: ETSCodeSelectedRow.eic,
            ETSCode: organisation.ETSCode,
            stardDate: formatDate(aicStartDate),
            endDate: formatDate(aicEndDate),
            dataType: AICDATATYPE
        }
        getDataDB(aicParams).then(response => {
            setAicData(response);
        })
    }

    function handleAicSvToDBClicked2() {
        var data = getAllAicRows();
        var allFieldsNames = fieldNames.concat(eFields);
        if (data !== undefined && data.length > 0) {
            var smallData = data.map(element => {
                var changedData = {};

                allFieldsNames.forEach(fieldName => {
                    changedData[fieldName] = element[fieldName];
                });
                return changedData;
            });

            var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === aicSelectedId })[0]
            var dataToSave = {
                EIC: ETSCodeSelectedRow.eic,
                ETSCode: organisation.ETSCode,
                Data: smallData,
                DataType: AICDATATYPE,
                FieldsNames: allFieldsNames
            }
            saveSmallData(dataToSave).then(response => {
                setdisplaySuccessMessage(true);
                setdisplayErrorMessage(false);
                resetMessages();
            })
        } else {
            setdisplaySuccessMessage(false);
            setdisplayErrorMessage(true);
            resetMessages();
        }

    }

    // =========================================================== Show and hide columns 

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                width: 250,
            },
        },
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        getContentAnchorEl: null
    };

    const constFieldsNames = [
        "dogalgaz",
        "ruzgar",
        "linyit",
        "tasKomur",
        "ithalKomur",
        "fuelOil",
        "jeotermal",
        "barajli",
        "nafta",
        "biokutle",
        "akarsu",
        "diger"
    ]

    const eFields = ["tarih", "saat", "toplam"]

    const [fieldNames, setFieldNames] = useState(["dogalgaz"]);

    const handleFieldNamesChanged = (event) => {
        const currentFields = event.target.value;
        const newColumns = [...gridColumnsDiffs];
        newColumns.forEach(column => {
            if (currentFields.includes(column.field)) {
                column.hide = false;
            } else if (eFields.includes(column.field)) {
                column.hide = false;
            } else {
                column.hide = true;
            }
        });
        setGridColumnsDiffs(newColumns);
        setFieldNames(event.target.value);
    };


    const handleFieldNamesChangedAic = (event) => {
        const currentFields = event.target.value;
        const newColumns = [...aicGridColumnsDiffs];
        newColumns.forEach(column => {
            if (currentFields.includes(column.field)) {
                column.hide = false;
            } else if (eFields.includes(column.field)) {
                column.hide = false;
            } else {
                column.hide = true;
            }
        });
        setAicGridColumnsDiffs(newColumns);
        setFieldNames(event.target.value);
    };


    // =========================================================== Upload file Dpp 


    const [dppFileToUpload, setDppFileToUpload] = useState(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    const dppHandleFileChange = (event) => {
        var file = event.target.files[0];
        setDppFileToUpload(file);
    }
    function Alert(props) {
        return <MuiAlert elevation={2} variant="filled" {...props} />;
    }

    const dppUploadFile = (event) => {

        const fileData = new FormData();
        fileData.append('excelFile', dppFileToUpload, dppFileToUpload.name);

        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === dppSelectedId })[0]
        var fileInfo = {
            SantralETSO: ETSCodeSelectedRow.eic,
            OrgaETSO: organisation.ETSCode,
            FileName: dppFileToUpload.name,
            DataType: DPPDATATYPE,
            Date: new Date()
        }

        fileData.append('fileInfo', JSON.stringify(fileInfo));

        uploadCentralData(fileData).then(response => {
            if (response.ok === true) {
                setSnackOpen(true);
            }
        })
    }

    // =========================================================== Upload File Aic 

    const [aicFileToUpload, setAicFileToUpload] = useState(null);

    const aicHandleFileChange = (event) => {
        var file = event.target.files[0];
        setAicFileToUpload(file);
    }

    const aicUploadFile = (event) => {

        const fileData = new FormData();
        fileData.append('excelFile', aicFileToUpload, aicFileToUpload.name);

        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === aicSelectedId })[0]
        var fileInfo = {
            SantralETSO: ETSCodeSelectedRow.eic,
            OrgaETSO: organisation.ETSCode,
            FileName: aicFileToUpload.name,
            DataType: AICDATATYPE,
            Date: new Date()
        }

        fileData.append('fileInfo', JSON.stringify(fileInfo));

        uploadCentralData(fileData).then(response => {
            if (response.ok === true) {
                setSnackOpen(true);
            }
        })
    }

    // =========================================================== FileGrid Dpp



    const FileGridColumns = [
        { field: "fileName", headerName: "File Name", width: 200 },
        { field: "user", headerName: "User", width: 120 },
        { field: "date", headerName: "Date", type: "date", width: 110 },
        { hide: true,  field: "error", headerName: "Error", type: "number", widht: 100 },
        { field: "state", headerName: "State", type: "boolean", width: 120 },
        {
            field: "message", headerName: "Message", type: "string", width: 300,
            cellClassName: (params) =>
                clsx('super-app', {
                    red: params.row.error === FILEERROR,
                    green: params.row.error === FILENOERROR
                })
        }
    ];

    const [dppFileGirdPopOpen, dppSetFileGridPopOpen] = useState(false);

    const dppHandleShowFilesClick = (event) => {
        dppSetFileGridPopOpen(true);
        getExcelFiles(dppSelectedId, DPPDATATYPE);
    };

    const dppHandleFileGridClose = () => {
        dppSetFileGridPopOpen(false);
    };

    const [exceFiles, setExcelFiles] = useState([]);

    function getExcelFiles(selectedId, datatype) {

        var ETSCodeSelectedRow = ETSCodeData.filter(row => { return row.id === selectedId })[0]

        var santralObject = {
            SantralETSO: ETSCodeSelectedRow.eic
        }

        getExcelFilesFromDB(santralObject).then(response => {

            if (datatype === DPPDATATYPE) {
                var dppResponse = response.filter(excelFile => excelFile.dataType === DPPDATATYPE);

                var neededData = dppResponse.map(excelFile => {
                    return {
                        id: excelFile.id,
                        state: (excelFile.state === 0 ? false : true),
                        message: excelFile.message,
                        date: excelFile.date,
                        user: "User",
                        fileName: excelFile.fileName,
                        error: excelFile.error
                    }
                });

                setExcelFiles(neededData);
            } else {
                var aicResponse = response.filter(excelFile => excelFile.dataType === AICDATATYPE);

                var neededData = aicResponse.map(excelFile => {
                    return {
                        id: excelFile.id,
                        state: (excelFile.state === 0 ? false : true),
                        message: excelFile.message,
                        date: excelFile.date,
                        user: "User",
                        fileName: excelFile.fileName,
                        error: excelFile.error
                    }
                });
                setExcelFiles(neededData);
            }
        });
    }

    // =========================================================== FileGrid Aic

    const [aicFileGirdPopOpen, aicSetFileGridPopOpen] = useState(false);

    const aicHandleShowFilesClick = (event) => {
        aicSetFileGridPopOpen(true);
        getExcelFiles(aicSelectedId, AICDATATYPE);
    };

    const aicHandleFileGridClose = () => {
        aicSetFileGridPopOpen(false);
    };

    // =========================================================== Render
    return (
        <div className="home">
            {!isDataLoaded ? fetchData() : null}
            <div style={{ width: "50%", marginTop: 20 }}>
                <Select
                    options={organisations}
                    onChange={opt => updateOrga(opt)}

                />
            </div>  {/*Select*/}
            <div className="container" style={{ fontSize: "1rem", marginTop: 50, marginLeft: 0 }}>
                <div className="row">
                    <div className="col">
                        <h3>Name</h3>
                        <p> {organisation.label}</p>
                    </div>
                    <div className="col">
                        <h3>ID</h3>
                        <p> {organisation.value}</p>
                    </div>
                    <div className="w-100"></div>
                    <div className="col">
                        <h3>Status</h3>
                        <p> {organisation.status}</p>
                    </div>
                    <div className="col">
                        <h3>ETSCode</h3>
                        <p> {organisation.ETSCode}</p>
                    </div>
                    <div className="w-100"></div>
                    <div className="col">
                        <h3>Short Name</h3>
                        <p> {organisation.shortName}</p>
                    </div>
                </div>
            </div>  {/*Bootstrap Grid*/}
            {
                (ETSCodeData.length !== 0) ?
                    <div>
                        <h3 style={{ marginTop: 30 }}>Injection Unit Names</h3>
                        <div className="ag-theme-alpine" style={{ width: 700, height: 200, marginTop: 30 }}>
                            <AgGridReact
                                columnDefs={ETCodeGrid.columnDefs}
                                frameworkComponents={ETCodeGrid.frameworkComponents}
                                rowData={ETSCodeData}
                                defaultColDef={ETCodeGrid.defaultColDef}
                            />
                        </div> {/*EIC Grid*/}
                        <Popover
                            open={dppPopoverOpen}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: 100, left: 800 }}
                            onClose={handleDppPopoverClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center"
                            }}
                        >
                            <div style={{ margin: 10 }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        style={{ marginRight: 30 }}
                                        variant="inline"
                                        label="Start Date"
                                        disableFuture
                                        value={dppStartDate}
                                        onChange={setDppStartDate}
                                    />

                                    <DatePicker
                                        variant="inline"
                                        label="End Date"
                                        disableFuture
                                        value={dppEndDate}
                                        onChange={setDppEndDate}
                                    />
                                    <div>
                                        <Button variant="contained" onClick={handleDppServiceClicked} style={{ marginTop: 5 }}>Service</Button>
                                        <Button variant="contained" onClick={handleDppDatabaseClicked} style={{ marginTop: 5, marginLeft: 10 }}>Get Service Data From Database</Button>
                                        <Button variant="contained" onClick={handleDppSvToDBClicked2} style={{ marginTop: 10, marginLeft: 10 }}>Save to Database</Button>
                                    </div>
                                    <div>
                                        <input type="file" onChange={dppHandleFileChange} style={{ marginTop: 10 }} accept=".xlsx" />
                                        <Button variant="contained" onClick={dppUploadFile} style={{ marginTop: 10, marginLeft: 10 }}>Save File </Button>
                                        <Button variant="contained" onClick={dppHandleShowFilesClick} style={{ marginTop: 10, marginLeft: 10 }}> Show Files </Button>
                                        <Popover
                                            open={dppFileGirdPopOpen}
                                            onClose={dppHandleFileGridClose}
                                            anchorReference="anchorPosition"
                                            anchorPosition={{ top: 200, left: 800 }}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "center"
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "center"
                                            }}
                                        >
                                            <div style={{ height: 400, width: 900 }} className={classes.excelFileGrid}>
                                                <DataGrid
                                                    rows={exceFiles}
                                                    columns={FileGridColumns}
                                                />
                                            </div>
                                        </Popover>
                                    </div>

                                    {displaySuccessMessage ?
                                        <p style={{ display: "inline", marginLeft: 10, color: "green" }}>Success</p>
                                        : null}
                                    {displayErrorMessage ?
                                        <p style={{ display: "inline", marginLeft: 10, color: "red" }}>Failure</p>
                                        : null}

                                    <div style={{ marginTop: 10 }}>
                                        <FormControl style={{ minWidth: 120, maxWidth: 300 }}>
                                            <InputLabel>Fields</InputLabel>
                                            <SelectMUI
                                                multiple
                                                value={fieldNames}
                                                onChange={handleFieldNamesChanged}
                                                input={<Input />}
                                                renderValue={selected => selected.join(', ')}
                                                MenuProps={MenuProps}

                                            >
                                                {constFieldsNames.map(field => (
                                                    <MenuItem key={field} value={field}>
                                                        <Checkbox checked={fieldNames.indexOf(field) > -1} />
                                                        <ListItemText primary={field} />
                                                    </MenuItem>
                                                ))}
                                            </SelectMUI>
                                        </FormControl>
                                    </div>

                                </MuiPickersUtilsProvider>
                            </div>
                            <div className="ag-theme-alpine" style={{ padding: 10, width: 1000, height: 550 }}>

                                {dppData.length !== 0 ?
                                    <AgGridReact

                                        rowData={dppData}
                                        defaultColDef={defaultColDef}
                                        onGridReady={onDppGridReady}
                                        onCellValueChanged={onDppCellValueChanged}
                                        pagination={true}
                                        applyColumnDefOrder={true}
                                    >
                                        {gridColumnsDiffs.map(column => (<AgGridColumn {...column} key={column.field} />))}
                                    </AgGridReact>
                                    : null}
                            </div>
                        </Popover> {/*Dpp Popover*/}
                        <Popover
                            open={aicPopoverOpen}
                            anchorReference="anchorPosition"
                            anchorPosition={{ top: 100, left: 800 }}
                            onClose={handleAicPopoverClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center"
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center"
                            }}
                        >
                            <div style={{ margin: 10 }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        style={{ marginRight: 30 }}
                                        variant="inline"
                                        label="Start Date"
                                        disableFuture
                                        value={aicStartDate}
                                        onChange={setAicStartDate}
                                    />

                                    <DatePicker
                                        variant="inline"
                                        label="End Date"
                                        disableFuture
                                        value={aicEndDate}
                                        onChange={setAicEndDate}
                                    />
                                    <div>
                                        <Button variant="contained" onClick={handleAicServiceClicked} style={{ marginTop: 5 }}>Service</Button>
                                        <Button variant="contained" onClick={handleAicDatabaseClicked} style={{ marginTop: 5, marginLeft: 10 }}>Get Service Data From Database</Button>
                                        <Button variant="contained" onClick={handleAicSvToDBClicked2} style={{ marginTop: 5, marginLeft: 10 }}>Save to Database</Button>
                                    </div>
                                    <div>
                                        <input type="file" onChange={aicHandleFileChange} style={{ marginTop: 10 }} accept=".xlsx" />
                                        <Button variant="contained" onClick={aicUploadFile} style={{ marginTop: 10, marginLeft: 10 }}>Save File</Button>
                                        <Button variant="contained" onClick={aicHandleShowFilesClick} style={{ marginTop: 10, marginLeft: 10 }}> Show Files </Button>
                                        <Popover
                                            open={aicFileGirdPopOpen}
                                            onClose={aicHandleFileGridClose}
                                            anchorReference="anchorPosition"
                                            anchorPosition={{ top: 200, left: 800 }}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "center"
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "center"
                                            }}
                                        >
                                            <div style={{ height: 400, width: 900 }} className={classes.excelFileGrid}>
                                                <DataGrid
                                                    rows={exceFiles}
                                                    columns={FileGridColumns}
                                                />
                                            </div>
                                        </Popover>
                                    </div>

                                    {displaySuccessMessage ?
                                        <p style={{ display: "inline", marginLeft: 10, color: "green" }}>Success</p>
                                        : null}
                                    {displayErrorMessage ?
                                        <p style={{ display: "inline", marginLeft: 10, color: "red" }}>Failure</p>
                                        : null}
                                    <div style={{ marginTop: 10 }}>
                                        <FormControl style={{ minWidth: 120, maxWidth: 300 }}>
                                            <InputLabel>Fields</InputLabel>
                                            <SelectMUI
                                                multiple
                                                value={fieldNames}
                                                onChange={handleFieldNamesChangedAic}
                                                input={<Input />}
                                                renderValue={selected => selected.join(', ')}
                                                MenuProps={MenuProps}
                                            >
                                                {constFieldsNames.map(field => (
                                                    <MenuItem key={field} value={field}>
                                                        <Checkbox checked={fieldNames.indexOf(field) > -1} />
                                                        <ListItemText primary={field} />
                                                    </MenuItem>
                                                ))}
                                            </SelectMUI>
                                        </FormControl>
                                    </div>


                                </MuiPickersUtilsProvider>
                            </div>
                            <div className="ag-theme-alpine" style={{ padding: 10, width: 900, height: 600 }}>

                                {aicData.length !== 0 ?
                                    <AgGridReact

                                        rowData={aicData}
                                        defaultColDef={defaultColDef}
                                        onGridReady={onAicGridReady}
                                        onCellValueChanged={onAicCellValueChanged}
                                        pagination={true}
                                        applyColumnDefOrder={true}
                                    >
                                        {aicGridColumnsDiffs.map(column => (<AgGridColumn {...column} key={column.field} />))}
                                    </AgGridReact>


                                    : null}
                            </div>
                        </Popover> {/*Aic Popover*/}
                    </div> : null
            }
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={2000}
                open={snackOpen}
                onClose={handleSnackClose}
                message="Dosya yüklendi"
                key={"snackBar"}
            >
                <Alert onClose={handleSnackClose} severity="success">
                    Bildirim ayarı yapıldı!
                    </Alert>
            </Snackbar>
        </div >
    );
}

export default Home;