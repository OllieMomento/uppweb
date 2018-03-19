import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import Done from 'material-ui-icons/Done';
import NotStarted from 'material-ui-icons/NotInterested';

//import SearchBar from 'material-ui-search-bar'



const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    Div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    Status: {


    }
};




class ProjectNameAndStatus extends Component {

    getStatus(status) {
        var icon
        var text
        if (status === "done") {
            icon = <Done align="center"/>
            text = 'done'

        } else if (status === "inprogress") {
            icon = <QueryBuilder align="center" />
            text = 'in progress'
        } else {
            icon = <NotStarted align="center" />
            text = 'not started'
        }
        return (
            <div className="status" >
                <div align="center">
                    {icon}
                </div>
                <Typography variant="subheading" align="center" style={style.Status}>
                    {text}
                </Typography>
            </div>

        )
    }


    render() {
        return (
            <div style={style.Div}>
                <div className="ProjectName">
                    <Typography variant="caption" color="inherit" >
                        Project
                    </Typography>
                    <Typography variant="title" color="inherit" >
                        {this.props.project.name}
                    </Typography>
                </div>
                {this.getStatus(this.props.project.status)}




            </div>
        );
    }
}

export default ProjectNameAndStatus;
