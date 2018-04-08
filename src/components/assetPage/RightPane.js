import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

//import SearchBar from 'material-ui-search-bar'




const styles = {
    title: {
        margin: "1em"
    },
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    buttonAdd: {
        marginTop: "1em",
        marginRight: "1em",
        float: "right"
    }
}



class RightPane extends Component {

    constructor(props) {
        super(props);
        this.state = { selected: 1 };
    }

    handleClick = (event, id) => {
        console.log("clikc " + id)
        this.setState({ selected: id })
    }

    isSelected(id) {
        if (this.state.selected === id) {
            return true
        }
        return false
    }



    render() {

        return (
            <div >



                <Paper style={styles.root}>
                    <Typography variant="title" color="inherit" style={styles.title}>
                        Versions of {this.props.asset.typeOf} {this.props.asset.name}
                    </Typography>
                    <Table style={styles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name of version</TableCell>
                                <TableCell >Assignee</TableCell>
                                <TableCell >Description</TableCell>
                                <TableCell >Creation Date</TableCell>
                                <TableCell >Path</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {}
                            {this.props.asset.versions.map(n => {
                                const isSelected = this.isSelected(n.id);
                                return (
                                    <TableRow
                                        key={n.id}
                                        hover
                                        onClick={event => this.handleClick(event, n.id)}
                                        role="radiobutton"
                                        selected={isSelected}
                                    >
                                        <TableCell>{n.name}</TableCell>
                                        <TableCell numeric>{n.artist}</TableCell>
                                        <TableCell numeric>{n.desc}</TableCell>
                                        <TableCell numeric>{n.date}</TableCell>
                                        <TableCell numeric>{n.path}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                </Paper>
                <div>
                    <Button variant="raised" color="primary" style={styles.buttonAdd}>
                        Add New Version
                </Button>
                    <Button variant="raised" style={styles.buttonAdd}>
                        Approve version
                </Button>
                </div>

            </div>
        );
    }
}

export default RightPane;
