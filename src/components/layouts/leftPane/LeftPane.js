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
        console.log("PRDEL")

        //Project
        if (this.props.shots === null && this.props.asset === null) {
           
            var nameAndStatus = <ProjectNameAndStatus project={this.props.project} />
            var tabsBar = <TabsBar project={this.props.project} people={this.props.people} />
        }
        //Shots
        else if (this.props.shots !== null && this.props.asset === null) {
            console.log("SHOTTTTIK")
            console.log(this.props.shots)
            
            var nameAndStatus = <ShotNameAndStatus project={this.props.project} shots={this.props.shots} />
            var tabsBar = <TabsBar project={this.props.project} people={this.props.people} shots={this.props.shots} />
        }
        // Asset
        else{
            console.log(this.props.asset)
            var nameAndStatus = <AssetNameAndStatus project={this.props.project} shots={this.props.shots} asset={this.props.asset}/>
            var tabsBar = <TabsBar project={this.props.project} people={this.props.people} asset={this.props.asset}/>
        }

        return (
            <div style={style.LeftPane}>
                <div style={style.Div}>
                    {nameAndStatus}



                </div>
                {tabsBar}
                
            </div>
        );
    }
}

export default LeftPane;
