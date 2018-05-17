import React, { Component } from 'react';


import NameAndStatus from './NameAndStatus';
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
        var nameAndStatus
        var tabsBar
        
        //Project
        if (this.props.shots === null && this.props.asset === null) {           
             nameAndStatus = <NameAndStatus project={this.props.project} />
             tabsBar = <TabsBar project={this.props.project} people={this.props.people} />
        }
        //Shots
        else if (this.props.shots !== null && this.props.asset === null) {            
             nameAndStatus = <NameAndStatus project={this.props.project} shots={this.props.shots} />
             tabsBar = <TabsBar project={this.props.project} people={this.props.people} shots={this.props.shots} />
        }
        // Asset
        else{  
             nameAndStatus = <NameAndStatus project={this.props.project} shots={this.props.shots} asset={this.props.asset}/>
             tabsBar = <TabsBar project={this.props.project} people={this.props.people} asset={this.props.asset}/>
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
