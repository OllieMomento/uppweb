import React, { Component } from 'react';
import { Link } from "react-router-dom";
//import SearchBar from 'material-ui-search-bar'
import './Breadcrumbs.css'



const style = {
    Div: {
        paddingLeft: '1em',
        display: 'flex'
    },
    Ul: {
        display: 'flex',
        
        listStyle: 'none',
    },
    Li: {
    }

};




class Breadcrumbs extends Component {

    getPath(paths) {
        var pathTmp = paths.map(( path, index) => {
            return (<li key={index}> <a href={path.path}>{path.name}</a></li>)
        })
        
        return (
            <ul className="breadcrumb">                
                {pathTmp}
            </ul>
        )
    }

    render() {
        return (
            <div style={style.Div}>

                {this.getPath(this.props.paths)}

            </div>
        );
    }
}

export default Breadcrumbs;
