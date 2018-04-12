import React, { Component, createElement } from 'react';

import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import dateFormat from 'dateformat'

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
//import SearchBar from 'material-ui-search-bar'
import List, { ListItem, ListItemSecondaryAction, ListItemText, ListSubheader } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import axios from 'axios';

const style = {

    Div: {
        margin: '1em'
    },
    elementWindow: {
        marginBottom: "1em",
    }
};



class AddNewProject extends Component {

    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            open: false,
            data: ""

        }
    }
    filterUpdate(value) {
        this.setState({
            filterText: value
        })
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    updateProjectOnServer(newProject) {

        var projects = this.state.data
        projects.push(newProject)
        console.log(projects)



        axios.post('http://localhost:3001/api/projects/', {
            newProject,

        })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

    }
    addNewProjectHandler = () => {
        var name = document.getElementById("nameWindow")
        var desc = document.getElementById("descriptionWindow")
        var start = document.getElementById("startDate")
        var end = document.getElementById("endDate")
        var file = document.getElementById("inputWindow")

        //if (file.files[0] != null) {




        axios.post('http://localhost:3001/api/projects/', {
            name: name.value,
            desc: desc.value,
            start: start.value,
            end: end.value,      
            status: "inprogress",
            path: "C:/path/" + name.value.replace(" ", "_"),
            artists: [],
            supervisor: "None",
            comments: [],
            xml: "",
            seq: [],
            shots: [],
            assetsXML: "",
            assets: [],

        })
            .then(response => {
                this.props.loadProjectsFromServer()
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

       // this.updateProjectOnServer(newProject)
        this.setState({
            open: false,
            decs: desc.value,
        });



        /*
                } else {
                    var button = document.getElementById("fileDiv")
                    var para = document.createElement("p")
                    var text = document.createTextNode("File is required");
                    para.appendChild(text)
                    para.style.color = "red"
                    button.appendChild(para)
                }*/


    }
  


    render() {
        //console.log('filterText state from parent component', this.state.filterText)

        return (
            <div className="HomepageS">
                <Button variant="raised" color="primary" onClick={this.handleClickOpen}> Add New Project </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Adding new project"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">

                        </DialogContentText>

                        <TextField
                            style={style.elementWindow}
                            autoFocus
                            margin="dense"
                            id="nameWindow"
                            label="Name"
                            type="text"
                            fullWidth
                        />
                        <form noValidate id="dateWindow" style={style.elementWindow}>
                            <TextField
                                id="startDate"
                                label="Start"
                                type="date"
                                defaultValue="2018-04-24"

                            />
                            <TextField
                                id="endDate"
                                label="End"
                                type="date"
                                defaultValue="2018-04-24"

                            />
                        </form>

                        <TextField
                            style={style.elementWindow}
                            autoFocus
                            margin="dense"
                            id="descriptionWindow"
                            label="Description"
                            type="text"
                            fullWidth
                        />

                        <div id="fileDiv" style={style.elementWindow}>
                            <Typography variant="caption" color="inherit" style={style.delete}>
                                Choose Image
                            </Typography>
                            <Button id="buttonFile">
                                <form method="post" >
                                    <input id="inputWindow" type="file" />
                                </form>
                            </Button>
                        </div>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addNewProjectHandler} color="primary" autoFocus>
                            Add new Project
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

export default AddNewProject;
