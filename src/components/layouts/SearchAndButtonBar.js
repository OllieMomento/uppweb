import React, { Component } from 'react';
import SearchBar from 'material-ui-search-bar'
import AddNewProject from './../homepage/AddNewProject'



const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800,
 

    },
    Div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
};




class SearchAndButtonBar extends Component {

    filterUpdate(value) {
        const val = value
        this.props.filterUpdate(val)
    }

    render() {
        return (
            <div style={style.Div}>
                <AddNewProject project={this.props.project} loadProjectsFromServer={this.props.loadProjectsFromServer} people={this.props.people} />                

                <SearchBar
                    onChange={(value) => this.filterUpdate(value)}      
                    onRequestSearch={() => console.log('onRequestSearch')}                     
                    style={style.SearchBar}
                />
            </div>
        );
    }
}

export default SearchAndButtonBar;
