import React, { Component } from 'react';

import SearchAndButtonBar from './SearchAndButtonBar';

const style = {
    Paper: {
        padding: 10,
        margin: 5,
        textAlign: 'right',
        shadows: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
}

class Toolbar extends Component {

    render() {       
        return (
            <div className="Toolbar" >
                <div style={style.Paper}>
                
                    <SearchAndButtonBar
                        filterText={this.props.filterText}
                        filterUpdate={this.props.filterUpdate.bind(this)}
                        loadProjectsFromServer={this.props.loadProjectsFromServer}
                        people={this.props.people}                        
                    />
                </div>
            </div>
        );
    }
}

export default Toolbar;
