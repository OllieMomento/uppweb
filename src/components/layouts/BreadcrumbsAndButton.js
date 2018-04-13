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
        console.log("KIKOOOT")
        if (this.props.project.shots != null) {
            var path = ""
            var name = ""
            this.props.project.shots.map(shot => {
                if(path===""){
                    path = shot.id
                    name = shot.name.replace("Shot","")
                }else{
                    path = path +"_"+ shot.id
                    name = name + " "+ shot.name.replace("Shot ","")
                }
                
            })
            console.log(path)
            console.log(name)
            paths.push({
                name: "Shots " + name,
                path: "http://localhost:3000/projects/" + this.props.project._id + "/shots/" + path
            })

        }



        /*
        
        this.props.project.shots.map(shot=>{
            console.log(shot)
        })
        
        paths.push({
            name: this.props.shots,
            path: "http://localhost:3000/shots/" + this.props.project._id
        })
        */


        //var breadcrumbs = 
        return (
            <div style={style.Div}>
                <Breadcrumbs paths={paths} />
            </div>
        );
    }
}

export default BreadcrumbsAndButton;
