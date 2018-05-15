
import React, { Component } from 'react';

import { FormControl, InputLabel, Select, MenuItem, Button, IconButton , Typography} from 'material-ui';
import { AddCircle } from 'material-ui-icons';
import TextField from 'material-ui/TextField';


import Dialog, {
    DialogActions,
    DialogContent,    
    DialogTitle,
} from 'material-ui/Dialog';
import axios from 'axios';
import { CirclePicker } from 'react-color';




const style = {

    seq: {
        display: "flex"
    }
};


class SequenceTool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            seq: this.props.project.seq,
            activeSeq: this.props.activeSeq,
            color: "#f44336"
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    addNewSequenceHandler = () => {
        var name = document.getElementById("nameWindow")

        if (name.value != null) {



            var newSequence = {
                name: name.value,
                nodes: [],
                edge: [],
                id: Date.now(),
                color: this.state.color
            }

            this.updateSequenceOnServer(newSequence)

            this.setState({
                open: false,
            });





        } else {
            var button = document.getElementById("fileDiv")
            var para = document.createElement("p")
            var text = document.createTextNode("File is required");
            para.appendChild(text)
            para.style.color = "red"
            button.appendChild(para)
        }


    }

    handleColorChange = (color) => {
        this.setState({ color: color.hex });
      };

    updateSequenceOnServer(newSequence) {

        var seq = this.props.project.seq


        seq.reverse().push(newSequence)
        seq.reverse()





        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            seq: seq,

        })
            .then(response => {
                //console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

        this.props.setActiveSeq()
    }


    render() {    
       
        return (
            <div style={style.seq}>
                <IconButton onClick={this.handleClickOpen} aria-label="add new sequence">
                    <AddCircle />
                </IconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Adding new sequence"}</DialogTitle>
                    <DialogContent>

                        <TextField
                            autoFocus
                            margin="dense"
                            id="nameWindow"
                            label="Name"
                            type="text"
                            fullWidth
                        />
                        <Typography variant="subheading" color="inherit" style={{marginTop: "1em", marginBottom: "0.5em"}}>
                            Choose color for new sequence
                        </Typography>
                        <CirclePicker 
                        color={this.state.color}
                        onChangeComplete={ this.handleColorChange }
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addNewSequenceHandler} color="primary" autoFocus>
                            Add new version
                        </Button>
                    </DialogActions>
                </Dialog>
                <form autoComplete="off">
                    <FormControl >
                        <InputLabel htmlFor="seq-simple">Sequence</InputLabel>
                        <Select
                            value={this.props.activeSeqName}                            
                            onChange={this.props.handleChangeActiveSeq}
                            inputProps={{
                                name: 'activeSeqName',
                                id: 'seq-simple',
                            }}

                        >

                            {this.props.project.seq.map(seq => {                           
                                
                                return (<MenuItem style={{color: seq.color}} key={seq.id} value={seq.name}>{seq.name} </MenuItem>)
                            })}

                        </Select>
                    </FormControl>
                </form>
            </div>
        )
    }
}
export default SequenceTool;
