import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { Link } from "react-router-dom";

import ProjectNameAndStatus from './ProjectNameAndStatus';
//import SearchBar from 'material-ui-search-bar'



const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    }
    
};




class LeftPane extends Component {


    render() {
        return (
            <div style={style.Div}>
            <ProjectNameAndStatus project={this.props.project}/>
                
                
            </div>
        );
    }
}

export default LeftPane;
