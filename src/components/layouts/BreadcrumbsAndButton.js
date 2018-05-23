import React, { Component } from 'react';

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

        //breadcrumbs
        var paths = []
        //home
        paths.push({
            name: "Home",
            path: "http://localhost:3000"
        })
        //project
        paths.push({
            name: this.props.project.name,
            path: "http://localhost:3000/projects/" + this.props.project._id
        })

        //if in shot hiearchy
        if (this.props.shots != null) {
            var path = ""
            var name = ""
            this.props.shots.map(shot => {
                if(path===""){
                    path = shot.id
                    name = shot.name.replace("Shot","")
                }else{
                    path = path +"_"+ shot.id
                    name = name + " "+ shot.name.replace("Shot ","")
                }
                return ""
            })
            //shot
            paths.push({
                name: "Shots " + name,
                path: "http://localhost:3000/projects/" + this.props.project._id + "/shots/" + path
            })
        }
    
        //if in asset hiearchy
        if (this.props.asset != null) {     
            //asset
            paths.push({
                name: this.props.asset.typeOf + "  "+this.props.asset.name,
                path: ""
            })
        }        
        return (
            <div style={style.Div}>
                <Breadcrumbs paths={paths} />
            </div>
        );
    }
}

export default BreadcrumbsAndButton;
