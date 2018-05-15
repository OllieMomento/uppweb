import React, { Component } from 'react';
import Button from 'material-ui/Button';
import dateFormat from 'dateformat'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import List, { ListItem,  ListItemText, ListSubheader } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import axios from 'axios';

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
        var file = document.getElementById("inputWindow")
    

        // file is chosen
        if (file.files[0] != null) {
            var newVersion = {
                id: Date.now(),
                commentsImplemented: this.state.checked,                
                name: file.files[0].name,
                artist: "Karel Novák",
                desc: desc.value,
                date: dateFormat(Date.now(), "mmmm dS, yyyy, h:MM:ss TT"),
                path: "C:/path/" + file.files[0].name,
                approved: false
            }

            this.updateVersionsOnServer(newVersion)
            this.setState({
                open: false,
                decs: desc.value,
                checked: []
            });

        // file is not chosen
        } else {
            var button = document.getElementById("fileDiv")
            var para = document.createElement("p")
            var text = document.createTextNode("File is required");
            para.appendChild(text)
            para.style.color = "red"
            button.appendChild(para)
        }


    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        //if somethin is checked
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    //update version on server
    updateVersionsOnServer(newVersion) {

        var assetID = this.props.asset.id

        let assets = this.props.project.assets
        let index = assets.findIndex(x => x.id === assetID);

        var versions = assets[index].versions.reverse()
        versions.push(newVersion)
        versions.reverse()

        this.props.updateTable(versions)

        assets[index].versions = versions
        assets[index].status ="inprogress"

        this.props.updateAsset(assets[index])       
        

        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            assets: assets,           
         
        })
            .then(response => {
                
            })
            .catch(err => {
                console.log(err);
            });
    }


    render() {
      
        //method for unique array
        Array.prototype.unique = function() {
            return this.filter(function (value, index, self) { 
              return self.indexOf(value) === index;
            });
          }

        var commentsImplemented = []

        // Implemented comments in version
        this.props.asset.versions.map( version =>{
            version.commentsImplemented.map(comment =>{
                commentsImplemented.push(comment)
                return ""
            })
            return ""
           
        })
        // unique array
        commentsImplemented = commentsImplemented.unique()
    
        //pendings comments
        var pendingComments = this.props.asset.comments.filter(comment => {
            return( !commentsImplemented.includes(comment.id))
        })


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
                        <div id="fileDiv">
                            <Button id="buttonFile">
                                <form method="post" >
                                    <input id="inputWindow" type="file" required />
                                </form>
                            </Button>
                        </div>
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
                                {pendingComments.map(value => (
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
