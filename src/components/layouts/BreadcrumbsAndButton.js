import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { Link } from "react-router-dom";
//import SearchBar from 'material-ui-search-bar'
import Breadcrumbs from './Breadcrumbs'



const style = {

    Div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "#eeeeee"
    }
};




class BreadcrumbsAndButton extends Component {

    render() {

        var url = window.location.href
        var projectURL = url.split("/")

        var paths = []
        paths.push({
            name: "Home",
            path: "http://localhost:3000"
        })
        paths.push({
            name: this.props.project.name,
            path: "http://localhost:3000/projects/" + this.props.project._id
        })

        //ProejctPage
        if(projectURL.length = 5){
            
        }
        //var breadcrumbs = 
        return (
            <div style={style.Div}>
                <Breadcrumbs paths = {paths}/>
                <Link to='/test' style={{ textDecoration: 'none', padding:'0.5em' }}>
                    <Button variant="raised" color="default">
                        View Diagram
                    </Button>
                </Link>

            </div>
        );
    }
}

export default BreadcrumbsAndButton;
