import React, { Component } from 'react';

import ShotNameAndStatus from './ShotNameAndStatus';
import ProjectNameAndStatus from './ProjectNameAndStatus';
import AssetNameAndStatus from './AssetNameAndStatus';
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

        //Project
        if (this.props.shots === null && this.props.asset === null) {
            var nameAndStatus = <ProjectNameAndStatus project={this.props.project} />
        }
        //Shots
        else if (this.props.shots !== null && this.props.asset === null) {
            var nameAndStatus = <ShotNameAndStatus project={this.props.project} shots={this.props.shots} />
        }
        // Asset
        else{

            var nameAndStatus = <AssetNameAndStatus project={this.props.project} shots={this.props.shots} asset={this.props.asset}/>
        }

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
