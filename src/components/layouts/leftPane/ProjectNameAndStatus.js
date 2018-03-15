import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { Link } from "react-router-dom";
import Typography from 'material-ui/Typography';
//import SearchBar from 'material-ui-search-bar'



const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    
};




class ProjectNameAndStatus extends Component {


    render() {
        return (
            <div style={style.Div}>
                <div className="ProjectName">
                    <Typography variant="title" color="inherit" >
                        Project
                    </Typography>
                    <Typography variant="title" color="inherit" >
                        Honda
                    </Typography>

                </div>

            </div>
        );
    }
}

export default ProjectNameAndStatus;
