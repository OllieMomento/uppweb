
import React, { Component } from 'react';

import {  Button} from 'material-ui';

import Dialog, {
    DialogActions,
    DialogContent,    
    DialogTitle,
} from 'material-ui/Dialog';

import { getSuggestions, renderInput, renderSuggestionsContainer, renderSuggestion } from '../../functions/autosuggest'
import Autosuggest from 'react-autosuggest';


const style = {
    seq: {
        display: "flex"
    }
};


class AddAssignee extends Component {

    constructor(props) {
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

    //get name of person based on ID
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
        const people = this.props.people
            .map(human => {
                return { label: human.name, id: human._id }
            })
        return (people)
    }

    handleSuggestionsFetchRequested = ({ value }) => {        
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

    //assign artist
    assignArtist = () => {       
        var template = document.createElement('template');
        var value = this.props.cell.value.trim()
        template.innerHTML = value;
        value = template.content.firstChild;

        //Assiginee        
        value.getElementsByTagName("h5")[0].innerHTML = this.state.value
        value.getElementsByTagName("h5")[0].dataset.artist = this.state.artistID


        //place the name into cell
        this.props.cell.setValue("<div>" + value.innerHTML + "</div>")

        this.props.editor.graph.refresh()

        this.setState({
            artistID: "",
            value: ""
        })

        this.props.handleWindowOpen(false)
    }

    handleColorChange = (color) => {        
        this.setState({ color: color.hex });
    };


    render() {
       
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
