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
        paths.push({
            name: "Home",
            path: "http://localhost:3000"
        })
        paths.push({
            name: this.props.project.name,
            path: "http://localhost:3000/projects/" + this.props.project._id
        })

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

            paths.push({
                name: "Shots " + name,
                path: "http://localhost:3000/projects/" + this.props.project._id + "/shots/" + path
            })
        }
    
        if (this.props.asset != null) {
     
            
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
