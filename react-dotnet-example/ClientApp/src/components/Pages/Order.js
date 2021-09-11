import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SwipeableViews from 'react-swipeable-views';
import TabPanel from '../TabPanel';
import { getOrgaSantral, saveOrder, getOrders } from '../../services/Service';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
    layout: {
        // spacing around the paper
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        height: '95vh'
    },
    mainPaper: {
        margin: theme.spacing(2), // the space around the paper
        height: '100%', // make the paper as big as the layout
        marginBottom: theme.spacing(2)
    },
    menuButton: {
        marginRight: theme.spacing(2) // margen to the menu button
    },
    title: {
        flexGrow: 1 // make title right and button left
    },
    formTitle: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),
        fontWeight: 'bold'
    },
    formInputs: {
        marginBottom: theme.spacing(1)
    },
    mainGrid: {
        marginRight: theme.spacing(1)
    },
    tabs: {
        marginTop: theme.spacing(2)
    },
    dataSource: {
        marginTop: theme.spacing(2)
    },
    list: {
        overflow: 'auto',
        maxHeight: '78vh'
    }
}));

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`
    };
}
function Order() {

    // =========================================================== Consts

    const DPPINDEX = 0;
    const AICINDEX = 1;
    const DATABASE = 0;
    const SERVICE = 1; //todo set the menu to default values
    const TEMPLATE = 2; 
    const ACTIVE = 1;
    const PASSIVE = 0; 
    const MAXLISTSIZE = 100;
    const classes = useStyles();
    const theme = useTheme();

    // =========================================================== TAP

    const [currentTap, setCurrentTap] = React.useState(DPPINDEX);

    const handleTapChange = (event, newValue) => {
        setCurrentTap(newValue);
    };
    const handleChangeIndex = index => {
        setCurrentTap(index);
    };

    // =========================================================== List

    const [selectedSantralId, setSelectedSantralId] = React.useState(-1);
    const [displayTextFieldError, setDisplayTextFieldError] = React.useState(false);
    const [orgaSantral, setOrgaSantral] = useState([]);
    const [miniSantrals, setMiniSantrals] = useState([]);
    const [selectedSantral, setSelectedSantral] = React.useState({
        id: 0,
        name: "",
        eic: "",
        organizationId: 0,
        organization: {
            id: 0,
            organizationId: 0,
            organizationName: "",
            organizationStatus: "",
            organizationETSOCode: "",
            organizationShortName: "",
        }
    });

    const handleListItemClick = (event, santralId) => {
        setSelectedSantralId(santralId);
        var selectedItem = orgaSantral.find(element => element.id === santralId);
        setSelectedSantral(selectedItem);
        setDisplayTextFieldError(false);
        selectOrder(selectedItem);
    };

    function handleSearch(event) {
        const text = event.target.value;

        var selectedSantrals = orgaSantral.filter(element => {
            return element.name.toLowerCase().includes(text.toLowerCase())
        });
        setMiniSantrals(selectedSantrals);
    }

    function loadOrgaSantral() {
        getOrgaSantral().then(data => {
            console.log(data);
            setOrgaSantral(data);
            setMiniSantrals(data);
        })
    }

    // =========================================================== DPP

    const [dppSelectedDate, dppHandleDateChange] = useState(
        new Date()
    );
    const [dppDataSource, dppSetDataSource] = React.useState(DATABASE);
    const [dppActive, dppSetActive] = useState(PASSIVE);


    const dppHandleDataSourceChange = event => {
        dppSetDataSource(event.target.value);
    };
    const dppSwitchChange = event => {
        dppSetActive(!dppActive);
    };

    // =========================================================== AIC
    const [aicSelectedDate, aicHandleDateChange] = useState(
        new Date()
    );
    const [aicDataSource, aicSetDataSource] = React.useState(DATABASE);
    const [aicActive, aicSetActive] = useState(PASSIVE);


    const aicHandleDataSourceChange = event => {
        console.log(aicSelectedDate);
        aicSetDataSource(event.target.value);
    };
    const aicSwitchChange = event => {
        aicSetActive(!aicActive);
    };

    // =========================================================== Snackbar

    const [snackOpen, setSnackOpen] = useState(false);
    const handleSnackClose = () => {
        setSnackOpen(false);
    };

    function Alert(props) {
        return <MuiAlert elevation={2} variant="filled" {...props} />;
    }

    // =========================================================== Save To Database 

    function handleSaveButton() {
        if (selectedSantralId === -1) {
            setDisplayTextFieldError(true);
        } else {

            console.log(dppSelectedDate);

            var dppOrdersToSave = {
                SantralETSO: selectedSantral.eic,
                OrgaETSO: selectedSantral.organization.organizationETSOCode,
                Time: dppSelectedDate,
                State: dppActive ? ACTIVE : PASSIVE,
                DataSource: dppDataSource,
                DataType: DPPINDEX,
                ExecutionTimes: 0
            }

            var aicOrderToSave = {
                SantralETSO: selectedSantral.eic,
                OrgaETSO: selectedSantral.organization.organizationETSOCode,
                Time: aicSelectedDate,
                State: aicActive? ACTIVE : PASSIVE,
                DataSource: aicDataSource,
                DataType: AICINDEX,
                ExecutionTimes: 0
            }
            saveOrder(dppOrdersToSave).then(outerResponse => {
                
            })
            saveOrder(aicOrderToSave).then(response => {
                setSnackOpen(true);
                getAllOrders(); 
            })
        }
    }

    // =========================================================== load orders 

    const [orders, setOrders] = useState([]);
    const [areOrdersLoaded, setAreOrdersLoaded] = useState(false); 

    // load order at the beginning 
    function getAllOrders() {
        getOrders().then(response => {
            console.log(response);
            setOrders(response);
            setAreOrdersLoaded(true); 
        })
    }

    // Select the order that is associated with the selected santral 
    function selectOrder(selectedSantral) {
        console.log(selectedSantral);

        var ordersOfSantral = orders.filter(order => order.santralETSO === selectedSantral.eic);
        console.log(ordersOfSantral);

        if (ordersOfSantral.length !== 0) {
            ordersOfSantral.forEach(order => {
                if (order.dataType === DPPINDEX) {
                    dppSetActive(order.state);
                    dppSetDataSource(order.dataSource);
                    dppHandleDateChange(new Date(order.time));
                }
                else // order.dataType == AICINDEX
                {
                    aicSetActive(order.state);
                    aicSetDataSource(order.dataSource);
                    aicHandleDateChange(new Date(order.time));
                }
            });
        } else { // reset fields 
            dppSetActive(PASSIVE);
            dppSetDataSource(DATABASE);
            dppHandleDateChange(new Date());

            aicSetActive(PASSIVE);
            aicSetDataSource(DATABASE);
            aicHandleDateChange(new Date());
        }
    }


    // =========================================================== RENDER

    return (
        <React.Fragment>
            {orgaSantral.length === 0 ? loadOrgaSantral() : null}
            {areOrdersLoaded ? null : getAllOrders()}
            <CssBaseline />
            <main className={classes.layout}>
                <Paper className={classes.mainPaper}>
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <Typography variant="body1" className={classes.title}>
                                Otomatik Bildirim Ayarlari
                            </Typography>
                            <Button onClick={handleSaveButton} variant="contained" color="inherit">
                                KAYDET
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                id="santral-search"
                                style={{ margin: 8 }}
                                placeholder="Santral Arama"
                                fullWidth
                                margin="normal"
                                type="search"
                                variant="standard"
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <List className={classes.list}>
                                {
                                    miniSantrals.slice(0, MAXLISTSIZE).map((santral) => {
                                        return (<React.Fragment key={santral.id}>
                                            <ListItem
                                                button
                                                selected={selectedSantralId === santral.id}
                                                onClick={event => handleListItemClick(event, santral.id)}
                                                alignItems="flex-start"
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        alt={santral.name.trim()}
                                                        src={santral.name.trim()}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={santral.name.trim()}
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                        );
                                    })
                                }
                            </List>
                        </Grid>
                        <Grid item xs className={classes.mainGrid}>
                            <Typography variant="body1" className={classes.formTitle}>
                                Genel Bilgiler
                            </Typography>
                            <hr />
                            <form noValidate autoComplete="off">
                                <TextField
                                    error={displayTextFieldError}
                                    id="organisation-name"
                                    label="Şirket"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    className={classes.formInputs}
                                    variant="filled"
                                    value={selectedSantral.organization.organizationName}
                                />
                                <TextField
                                    error={displayTextFieldError}
                                    id="organisation-etso"
                                    label="Şirket ETSO"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    className={classes.formInputs}
                                    variant="filled"
                                    value={selectedSantral.organization.organizationETSOCode}
                                />
                                <TextField
                                    error={displayTextFieldError}
                                    id="santral"
                                    label="Santral"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    className={classes.formInputs}
                                    variant="filled"
                                    value={selectedSantral.name}
                                />
                                <TextField
                                    error={displayTextFieldError}
                                    id="santral-etso"
                                    label="Santral ETSO"
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    className={classes.formInputs}
                                    variant="filled"
                                    value={selectedSantral.eic}
                                />

                                <React.Fragment>
                                    <AppBar
                                        position="static"
                                        color="default"
                                        className={classes.tabs}
                                    >
                                        <Tabs
                                            value={currentTap}
                                            onChange={handleTapChange}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="fullWidth"
                                            aria-label="full width tabs example"
                                        >
                                            <Tab label="DPP" {...a11yProps(DPPINDEX)} />
                                            <Tab label="AIC" {...a11yProps(AICINDEX)} />
                                        </Tabs>
                                    </AppBar>
                                    <SwipeableViews
                                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                        index={currentTap}
                                        onChangeIndex={handleChangeIndex}
                                    >
                                        {/*DPP Tap*/}
                                        <TabPanel value={currentTap} index={DPPINDEX}>
                                            <FormGroup col="true">
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={dppActive}
                                                            color="primary"
                                                            onChange={dppSwitchChange}
                                                        />
                                                    }
                                                    label="Durum"
                                                    labelPlacement="end"
                                                />

                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <TimePicker
                                                        ampm={false}
                                                        label="Bildirim Zamanı"
                                                        value={dppSelectedDate}
                                                        views={['hours', 'minutes']}
                                                        onChange={dppHandleDateChange}
                                                    />
                                                </MuiPickersUtilsProvider>
                                                <FormControl className={classes.dataSource}>
                                                    <InputLabel id="demo-simple-select-label">
                                                        Gönderilecek Veri
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={dppDataSource}
                                                        onChange={dppHandleDataSourceChange}
                                                        defaultValue={DATABASE}
                                                        MenuProps={{
                                                            anchorOrigin: {
                                                                vertical: 'bottom',
                                                                horizontal: 'left'
                                                            },
                                                            getContentAnchorEl: null
                                                        }}
                                                    >
                                                        <MenuItem value={DATABASE}>Database</MenuItem>
                                                        <MenuItem value={SERVICE}>Service</MenuItem>
                                                        <MenuItem value={TEMPLATE}>Şablon</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </FormGroup>
                                        </TabPanel>
                                        {/*AIC Tap*/}
                                        <TabPanel value={currentTap} index={AICINDEX}>
                                            <FormGroup col="true">
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={aicActive}
                                                            color="primary"
                                                            onChange={aicSwitchChange}
                                                        />
                                                    }
                                                    label="Durum"
                                                    labelPlacement="end"
                                                />

                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <TimePicker
                                                        ampm={false}
                                                        label="Bildirim Zamanı"
                                                        value={aicSelectedDate}
                                                        views={['hours', 'minutes']}
                                                        onChange={aicHandleDateChange}
                                                    />
                                                </MuiPickersUtilsProvider>
                                                <FormControl className={classes.dataSource}>
                                                    <InputLabel id="demo-simple-select-label">
                                                        Gönderilecek Veri
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={aicDataSource}
                                                        onChange={aicHandleDataSourceChange}
                                                        defaultValue={DATABASE}
                                                        MenuProps={{
                                                            anchorOrigin: {
                                                                vertical: 'bottom',
                                                                horizontal: 'left'
                                                            },
                                                            getContentAnchorEl: null
                                                        }}
                                                    >
                                                        <MenuItem value={DATABASE}>Database</MenuItem>
                                                        <MenuItem value={SERVICE}>Service</MenuItem>
                                                        <MenuItem value={TEMPLATE}>Şablon</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </FormGroup>
                                        </TabPanel>
                                    </SwipeableViews>
                                </React.Fragment>
                            </form>
                        </Grid>
                    </Grid>
                </Paper>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={2000}
                    open={snackOpen}
                    onClose={handleSnackClose}
                    message="bildirim ayarı yapıldı"
                    key={"snackBar"}
                >
                    <Alert onClose={handleSnackClose} severity="success">
                        Bildirim ayarı yapıldı!
                    </Alert>
                </Snackbar>
            </main>
        </React.Fragment>
    );
}

export default Order;