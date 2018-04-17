
import React, { Component } from 'react';

import { FormControl, InputLabel, Select, MenuItem, Button, IconButton, Typography } from 'material-ui';
import { Delete, Undo, Redo, AddCircle } from 'material-ui-icons';
import TextField from 'material-ui/TextField';


import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import axios from 'axios';

import { getSuggestions, renderInput, renderSuggestionsContainer, renderSuggestion } from '../../functions/autosuggest'
import Autosuggest from 'react-autosuggest';






const style = {

    seq: {
        display: "flex"
    }
};


class AddAssignee extends Component {

    constructor(props) {
        var editor
        super(props);
        this.state = {
            open: false,
            seq: this.props.project.seq,
            activeSeq: this.props.activeSeq,
            color: "#f44336",
            value: "",
            suggestions: [],
            artistID: ""
        };
    }

    getNameFromID(id) {
        //not assigned 
        if (id === "") {
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

    getPeople() {
        console.log(this.props.people)
        const people = this.props.people
            .map(human => {
                return { label: human.name, id: human._id }
            })
        return (people)
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        console.log("VALUE")
        console.log(value)
        this.setState({
            suggestions: getSuggestions(this.getPeople(), value),
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
            artistID: suggestion.id
        })
        return suggestion.label;
    }




    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    assignArtist = () => {
       
        console.log("CELL")
        console.log(this.props.cell)
        var assetID = parseInt(this.props.cell.id)

        var assets = this.props.assets
        console.log("ASSETS")
        console.log(assets)
        let index = assets.findIndex(x => x.id == assetID);


        console.log("INDEX")
        console.log(index)


        assets[index].artists = [this.state.artistID]

      

        //this.updateAssetsOnServer(assets)
        

        var template = document.createElement('template');
        var value = this.props.cell.value.trim()
        template.innerHTML = value;
        value = template.content.firstChild;

        var assignee = value.getElementsByTagName("h5")[0].innerHTML
        value.getElementsByTagName("h5")[0].setAttribute = ("data-artistID", this.state.artistID)
        value.getElementsByTagName("h5")[0].innerHTML = this.state.value

        console.log("VALUE INNER")
        console.log(value.innerHTML)

        this.props.cell.setValue("<div>" + value.innerHTML + "</div>")
        console.log("ASSIGNEE")
        console.log(assignee)
        this.props.editor.graph.refresh()

        this.setState({
            artistID:"",
            value:""
        })
        



    }

    handleColorChange = (color) => {
        console.log(color)
        this.setState({ color: color.hex });
    };

    updateAssetsOnServer(assets) {


        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            assets: assets,

        })
            .then(response => {
                //console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

        this.props.handleWindowOpen(false)

    }


    render() {
        console.log(this.props.people)

        return (
            <div style={style.seq}>

                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.handleWindowOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Assign artists"}</DialogTitle>
                    <DialogContent>

                        <Autosuggest
                            renderInputComponent={renderInput}
                            suggestions={this.state.suggestions}
                            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                            renderSuggestionsContainer={renderSuggestionsContainer}
                            getSuggestionValue={this.getSuggestionValue.bind(this)}
                            renderSuggestion={renderSuggestion}
                            inputProps={{
                                placeholder: 'Search Artist',
                                value: this.state.value,
                                onChange: this.handleChange,
                            }}
                        />


                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => this.props.handleWindowOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.assignArtist} color="primary" autoFocus>
                            Assign Artist
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }
}
export default AddAssignee;
