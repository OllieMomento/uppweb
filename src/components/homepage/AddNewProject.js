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
import { getSuggestions, renderInput, renderSuggestionsContainer, renderSuggestion } from '../../functions/autosuggest'
import Autosuggest from 'react-autosuggest';

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
            data: "",
            value: "",
            suggestions: [],
            supervisorID:""


        }
    }

    getNameFromID(id) {
        //not assigned supervisor
        if(id === ""){
            return ""
        }
        const name = this.props.people
            .filter(human => {
                return human._id === id
            }).map(human => {
                return (
                    human.name
                )
            })
        return (name[0])
    }

    getSupervisors() {
        console.log(this.props.people)
        const people = this.props.people
            .filter(human => {
                return human.supervisor === 1
            })
            .map(human => {
                return { label: human.name, id: human._id }
            })
        return (people)
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        console.log("VALUE")
        console.log(value)
        this.setState({
            suggestions: getSuggestions(this.getSupervisors(), value),
        });
    };

    handleSuggestionsClearRequested = () => {

        this.setState({
            suggestions: [],
        });
    };

    handleChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
    };

    getSuggestionValue(suggestion) {
        this.setState({
            supervisorID: suggestion.id
        })
        return suggestion.label; 
    }




    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

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
            supervisor: this.state.supervisorID,
            comments: [],
            xml: "",
            seq: [{
                "nodes": [],
                "edge": [],
                "id": 0,
                "name": "Normal",
                "color": "#f44336"
            }],
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

    }



    render() {
        //console.log('filterText state from parent component', this.state.filterText)

        return (
            <div >
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

                         <Autosuggest
                            renderInputComponent={renderInput}
                            suggestions={this.state.suggestions}
                            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                            renderSuggestionsContainer={renderSuggestionsContainer}
                            getSuggestionValue={this.getSuggestionValue.bind(this)}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: 'Search a supervisor',
                                value: this.state.value,
                                onChange: this.handleChange,
                            }}
                        />

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
