import React, { Component } from 'react';

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
        return (
            <div style={style.LeftPane}>
                <div style={style.Div}>
                    <ProjectNameAndStatus project={this.props.project} />



                </div>
                <TabsBar project={this.props.project} people={this.props.people}/>
            </div>
        );
    }
}

export default LeftPane;
