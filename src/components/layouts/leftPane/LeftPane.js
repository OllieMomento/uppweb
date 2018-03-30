import React, { Component } from 'react';

import ShotNameAndStatus from './ShotNameAndStatus';
import ProjectNameAndStatus from './ProjectNameAndStatus';
import TabsBar from './TabsBar';
//import SearchBar from 'material-ui-search-bar'



const style = {
    LeftPane: {
        width: 400,
        backgroundColor: "#eeeeee",

    },
    Div: {

        padding: "2em"

    }

};




class LeftPane extends Component {


    render() {

        if (this.props.shotID === null) {
            var nameAndStatus = <ProjectNameAndStatus project={this.props.project} />
        }
        else {
            var nameAndStatus = <ShotNameAndStatus project={this.props.project} shotID={this.props.shotID} />
        }
        console.log(this.props.project)
        return (
            <div style={style.LeftPane}>
                <div style={style.Div}>
                  {nameAndStatus}



                </div>
                <TabsBar project={this.props.project} people={this.props.people} />
            </div>
        );
    }
}

export default LeftPane;
