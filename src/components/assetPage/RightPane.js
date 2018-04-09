import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import CommentsBox from '../assetPage/CommentsBox'

//import SearchBar from 'material-ui-search-bar'




const styles = {
    title: {
        marginTop: "1.5em",
        marginLeft: "1.5em"
    },
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    
    tableAndButtons: {
        margin: "1em"
     
    },
    
    tableAndComments: {
        display: "flex",
        //justifyContent: "space-between"
    },
    table: {
        minWidth: 700,
    },
    buttonAdd: {
        marginTop: "1em",
        marginLeft: "1em",

        float: "right"
    }
}



class RightPane extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            selected: 1,
            selectedVersion: this.props.asset.versions[0]
         };
    }

    handleClick = (event, id, n) => {
        console.log( n)
        this.setState({
             selected: id,
             selectedVersion: n
         })
        
    }

    isSelected(id) {
        if (this.state.selected === id) {
            return true
        }
        return false
    }



    render() {

        var table = <Table style={styles.table}>
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
                {this.props.asset.versions.map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                        <TableRow
                            key={n.id}
                            hover
                            onClick={event => this.handleClick(event, n.id, n)}
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

        return (
            
                <div style={styles.root}>
                    <Typography variant="title" color="inherit" style={styles.title}>
                        Versions of {this.props.asset.typeOf} {this.props.asset.name}
                    </Typography>

                    <div style={styles.tableAndComments}>
                        <div style={styles.tableAndButtons}>
                            {table}
                            <div style={styles.buttons}>
                                <Button variant="raised" color="primary" style={styles.buttonAdd}>
                                    Add New Version
                        </Button>
                                <Button variant="raised" style={styles.buttonAdd}>
                                    Approve version
                        </Button>
                            </div>
                        </div>
                        <CommentsBox project={this.props.project} people={this.props.people} selectedVersion={this.state.selectedVersion}/>
                    </div>
                </div>             

           
        );
    }
}

export default RightPane;
