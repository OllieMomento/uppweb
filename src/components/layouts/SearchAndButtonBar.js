import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { Link } from "react-router-dom";
//import SearchBar from 'material-ui-search-bar'



const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    Div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
};




class SearchAndButtonBar extends Component {

    filterUpdate() {
        const val = this.myValue.value
        this.props.filterUpdate(val)

    }

    render() {
        return (
            <div style={style.Div}>
                <Link to='/test'  style={{ textDecoration: 'none' }}>
                    <Button variant="raised" color="default">
                        Create Project
                    </Button>
                </Link>

                <form>
                    <input
                        type="text"
                        ref={(value) => { this.myValue = value }}
                        placeholder="Type to filter..."
                        onChange={this.filterUpdate.bind(this)}
                    />
                </form>
            </div>
        );
    }
}

export default SearchAndButtonBar;
