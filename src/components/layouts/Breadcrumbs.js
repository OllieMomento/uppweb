import React, { Component } from 'react';
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
    } 

};




class Breadcrumbs extends Component {

    // get path in correct form
    getPath(paths) {
        var pathTmp = paths.map(( path, index) => {

            if(paths.length-1 === index){
                return (<li key={index}> {path.name}</li>)
            }
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
