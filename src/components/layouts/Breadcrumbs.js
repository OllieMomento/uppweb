import React, { Component } from 'react';
import Button from 'material-ui/Button';
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
        padding: '10px 16px',
        listStyle: 'none',
    },
    Li: {
    }

};




class Breadcrumbs extends Component {

    getPath(pathObj) {

        let url = 'http://localhost:3000/projects/'
        let path = pathObj
            .map((obj, index) => {               
                url = url + obj._id + '/';
                if(index+1 === pathObj.length){
                    return(<li key={index}>{obj.name}</li>)
                }
                return (<li key={index}><a href={url}>{obj.name}</a></li>)
            })
        return (
            <ul className="breadcrumb">
                <li><a href='http://localhost:3000/'>Home</a></li>
                {path}
            </ul>
        )
    }

    render() {
        
        this.getPath(this.props.path)
        return (
            <div style={style.Div}>

                {this.getPath(this.props.path)}

            </div>
        );
    }
}

export default Breadcrumbs;
