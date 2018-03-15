import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { Link } from "react-router-dom";
//import SearchBar from 'material-ui-search-bar'



const style = {
   
    Div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
};




class BreadcrumbsAndButton extends Component {

    render() {
        return (
            <div style={style.Div}>
            <p>prdeel</p>
                <Link to='/test'  style={{ textDecoration: 'none' }}>
                    <Button variant="raised" color="default">
                        View Diagram
                    </Button>
                </Link>
                
            </div>
        );
    }
}

export default BreadcrumbsAndButton;
