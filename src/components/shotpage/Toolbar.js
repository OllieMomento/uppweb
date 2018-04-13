import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import history from '../../history'
import axios from 'axios';
import LeftPane from '../layouts/leftPane/LeftPane'

import { getSuggestions, renderInput, renderSuggestionsContainer, renderSuggestion } from '../../functions/autosuggest'

import Autosuggest from 'react-autosuggest';


const style = {


};


class Toolbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            suggestions: [],
        };
    }

    handleSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(this.getAssetTypes(), value),
        });
    };

    getAssetTypes = () => {

        var array = [
            "Modelling",
            "Texturing",
            "Rigging",
            "Tracking",
            "Animation",
            "Simulation",
            "Rotoscoping",
            "Grading",
            "LooK Development",
            "Light & Render",
            "Matte Painting",
            "Compositing"
        ]
        var types = array.map( type=>{
            return { label: type}
        })
        return types
    }

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

        return suggestion.label;
    }


    render() {

        return (
            <div className="Toolbar" style={style.Page}>
                <Autosuggest
                    renderInputComponent={renderInput}
                    suggestions={this.state.suggestions}
                    onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                    renderSuggestionsContainer={renderSuggestionsContainer}
                    getSuggestionValue={this.getSuggestionValue.bind(this)}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        placeholder: 'Choose Asset Type',
                        value: this.state.value,
                        onChange: this.handleChange,
                    }}
                />
            </div>
        );
    }
}

export default Toolbar;
