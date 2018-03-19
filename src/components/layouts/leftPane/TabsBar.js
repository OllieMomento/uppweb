import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Info from './tabs/Info';
import CommentsBox from './tabs/CommentsBox';
import Team from './tabs/Team';




const style = {
    Tab: {
        minWidth: '133px' 

    },
    Div: {
        backgroundColor: "#eeeeee",
        padding: "2em"
    }

};




class TabsBar extends Component {
    state = {
        value: 0,
        
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };


    render() {

        const { value } = this.state;

        return (
            <div className="Tabs">
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"                    

                    >
                        <Tab style={style.Tab} label="Info" />
                        <Tab style={style.Tab} label="Comments" />
                        <Tab style={style.Tab} label="Team" />
                    </Tabs>
                </AppBar>
                {value === 0 && <Info  project={this.props.project} />}
                {value === 1 && <CommentsBox  project={this.props.project} people={this.props.people}/>}
                {value === 2 && <Team  project={this.props.project} people={this.props.people}/>}
            </div >
        );
    }
}

export default TabsBar;
