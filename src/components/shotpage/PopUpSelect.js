import React, { Component } from 'react';
import { ArrayAsset } from '../../data/assets'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';


const style = {
    popUp: {
        position: "fixed",
        display: "block",
        border: "1px",
        zIndex: 1000,
        background: "white"       
    }

};


class PopUpSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterText: "",
            activeAsset: ""
        };
    }

    filterUpdate() {
        const value = this.myValue.value

        this.setState({
            filterText: value
        })

    }

    getList() {
        var array = ArrayAsset.filter(asset => {

            return asset.toLowerCase().indexOf(this.state.filterText.toLowerCase()) >= 0
        }).map((asset, index) => {


            return <ListItem key={index} button onClick={() => this.props.setAsset(asset)}>
                <ListItemText primary={asset} />
            </ListItem>

        })

        var list = <List component="nav">
            {array}
        </List>
        return list
    }



    render() {

        return (
            <div id="popUpMenu" style={style.popUp}>

                <form>
                    <input
                        type="text"
                        ref={(value) => { this.myValue = value }}
                        placeholder="Type to filter..."
                        onChange={this.filterUpdate.bind(this)}
                    />
                </form>

                {this.getList()}

            </div>
        );
    }
}

export default PopUpSelect;
