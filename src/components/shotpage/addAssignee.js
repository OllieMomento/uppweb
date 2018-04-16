
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
        console.log(this.props.cell)
        var assetID = parseInt(this.props.cell.id)
        console.log(index)

        console.log(this.props.project)
        var assets = this.props.project.assets
        let index = assets.findIndex(x => x.id == assetID);
        console.log(index)
        var curAsset = assets[index]
        console.log(curAsset)
        curAsset.artists = this.state.artistID
        assets[index] = curAsset

        console.log(assets)

        // this.updateAssetsOnServer(assets)


    }

    handleColorChange = (color) => {
        console.log(color)
        this.setState({ color: color.hex });
    };

    updateSequenceOnServer(newSequence) {

        var seq = this.props.project.seq


        seq.reverse().push(newSequence)
        seq.reverse()





        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            seq: seq,

        })
            .then(response => {
                //console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

        this.props.setActiveSeq()
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
