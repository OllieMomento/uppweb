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
        return (
            <div style={style.Div}>
                <Breadcrumbs path = {this.props.path}/>
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
