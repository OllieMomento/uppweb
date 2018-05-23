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
    Tabs: {
        backgroundColor: "#eeeeee",        
        flexDirection: 'column',            
    }
};


class TabsBar extends Component {
    state = {
        value: 0,
        
    };

    //change selected tab
    handleChange = (event, value) => {
        this.setState({ value });
    };

    // Set selected tab to Info
    componentDidMount(){
        if(this.props.asset != null){
            this.setState({value:1})
        }

    }


    render() {

        const { value } = this.state;

        return (
            <div className="Tabs" style={style.Tabs}>
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
                {value === 0 && <Info  project={this.props.project} asset={this.props.asset}/>}
                {value === 1 && <CommentsBox project={this.props.project} people={this.props.people} asset={this.props.asset} />}
                {value === 2 && <Team  project={this.props.project} people={this.props.people}  asset={this.props.asset}/>}
            </div >
        );
    }
}

export default TabsBar;
