import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Paper from 'material-ui/Paper';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';

import { getSuggestions, renderInput, renderSuggestionsContainer, renderSuggestion } from '../../../../functions/autosuggest'

//import SearchBar from 'material-ui-search-bar'

const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    Div: {
        backgroundColor: "#eeeeee",
        padding: "2em"
    },
    Divdiv: {
        marginBottom: "1em"
    }

};



class Team extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.getNameFromID(this.props.project.supervisor),
            suggestions: [],
        };
    }

    getSupervisors() {
        const people = this.props.people
            .filter(human => {
                return human.supervisor === 1
            })
            .map(human => {
                return { label: human.name, id: human._id }
            })
        return (people)
    }

    getNameFromID(id) {
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


    handleSuggestionsFetchRequested = ({ value }) => {
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


    putDataOnServer(suggestion, project) {

        axios.put('http://localhost:3001/api/projects/' + project._id, {
            supervisor: suggestion.id
        }).then(response => {
            // console.log(response);
        })
            .catch(err => {
                console.log(err);
            });
    }

    getSuggestionValue(suggestion) {

        // console.log(this.props.project)
        this.putDataOnServer(suggestion, this.props.project)

        return suggestion.label;
    }

    render() {
        /*
        this.setState({
            value:(this.getNameFromID(this.props.project.supervisor))
        })*/

        return (
            <div style={style.Div} >
                <Typography variant="caption"  >
                    Supervisor
                </Typography>

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
            </div>
        );
    }
}

export default Team;
