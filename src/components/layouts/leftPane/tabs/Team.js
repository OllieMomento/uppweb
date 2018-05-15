import React, { Component } from 'react';
import Typography from 'material-ui/Typography';

import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import Chip from 'material-ui/Chip';

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
            artists: ""
        };
    }

    handleDelete = data => () => {  


    };
  

    //Get all supervisors
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
        //not assigned supervisor
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


    //Put supervisor on server
    putSupervisorOnServer(suggestion, project) {

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
        this.putSupervisorOnServer(suggestion, this.props.project)
        return suggestion.label;
    }



    render() {  
        
        var artists = this.props.project.assets.map(asset => {
            if(asset.artists != null){
                if (asset.artists.length === 1) {

                    return (this.getNameFromID(asset.artists[0]))
                }
            }
            return ""
            
        })
        

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

                <Typography variant="caption"  style={{marginTop: "2em"}}>
                    Artists
                </Typography>

                {artists.map((data,index) => {                    
                 
                    if(data === ""){
                        return ""
                    }

                    return (
                        <Chip
                            key={index}                          
                            label={data}
                            onDelete={this.handleDelete(data)}                          
                        />
                    );
                })}



            </div>
        );
    }
}

export default Team;
