import React, { Component } from 'react';

import Button from 'material-ui/Button';
import Input from 'material-ui/Input';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
//import SearchBar from 'material-ui-search-bar'
import List, { ListItem, ListItemSecondaryAction, ListItemText, ListSubheader } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

const styles = {

    buttonAdd: {
        marginTop: "1em",
        marginLeft: "1em",

        float: "right"
    },
    listItem: {
        padding: 0
    }
}



class AddNewVersion extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            checked: [],
            description: ""
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    addNewVersionHandler = () => {
        var desc = document.getElementById("descriptionWindow")
        var file = document.getElementById("inputWindow") /*
        console.log(file.files[0].name)
        console.log(desc.value)
        console.log(this.state.checked)
        this.setState({ 
            open: false,
            decs: desc.value,
         });

*/
    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };


    render() {
        return (
            <div >
                <Button variant="raised" color="primary" style={styles.buttonAdd} onClick={this.handleClickOpen}> Add New Version </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Adding new version"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">

                        </DialogContentText>
                        <Button >
                            <form>
                                <input id="inputWindow" type="file" required />
                            </form>
                        </Button>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="descriptionWindow"
                            label="Description"
                            type="text"
                            fullWidth
                        />
                        <div>

                            <List subheader={<ListSubheader style={styles.listItem} component="div">Check comments you solved</ListSubheader>}>
                                {this.props.asset.comments.map(value => (
                                    <ListItem
                                        key={value.id}
                                        role={undefined}
                                        dense
                                        button
                                        onClick={this.handleToggle(value.id)}
                                        style={styles.listItem}

                                    >
                                        <Checkbox
                                            checked={this.state.checked.indexOf(value.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                        <ListItemText primary={value.text} />

                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addNewVersionHandler} color="primary" autoFocus>
                            Add new version
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default AddNewVersion;
