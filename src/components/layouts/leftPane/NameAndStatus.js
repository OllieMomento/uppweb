import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import Done from 'material-ui-icons/Done';
import NotStarted from 'material-ui-icons/NotInterested';

const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    Div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
};




class NameAndStatus extends Component {

    //get status text and icon
    getStatus(status) {
        var icon
        var text
        //DONE
        if (status === "done") {
            icon = <Done align="center" />
            text = 'done'
        //IN PROGRESS
        } else if (status === "inprogress") {
            icon = <QueryBuilder align="center" />
            text = 'in progress'
        // NOT STARTED
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

        
        var url = window.location.href
        var shotIDs = url.split("/");

        var type = shotIDs[5]
        var name
        var status

        //ASSET PAGE
        if (type === "asset") {
            status = this.getStatus(this.props.asset.status)
            name = <div className="AssetName">
                        <Typography variant="caption" color="inherit" >
                            Asset
                        </Typography>
                        <Typography variant="subheading" color="inherit" >
                            {this.props.asset.typeOf}
                        </Typography>
                        <Typography variant="title" color="inherit" >
                            {this.props.asset.name}
                        </Typography>
                    </div>

        //SHOT PAGE
        } else if (type === "shots") {
            status = this.getStatus(this.props.project.status)
            var shots = this.props.shots

            var names = shots.map((shot, index)=>{
                let number = shot.name.replace("Shot ", "")
                if(index !== shots.length-1){  
                    number = number + ', '             
                }          
                
                return number
            })

            var caption = 'Shot'
            if (shots.length > 1) {
                caption = 'Shots'
            }


            name = <div className="ShotName">
                <Typography variant="caption" color="inherit" >
                    {caption}
                </Typography>
                <Typography variant="title" color="inherit" >
                    {names}
                </Typography>
            </div>

        //PROJECT PAGE
        } else {
            status = this.getStatus(this.props.project.status)
            name = <div className="ProjectName">
                <Typography variant="caption" color="inherit" >
                    Project
                        </Typography>
                <Typography variant="title" color="inherit" >
                    {this.props.project.name}
                </Typography>
            </div>

        }

        return (
            <div style={style.Div}>
                {name}
                {status}                
            </div>
        );
    }
}

export default NameAndStatus;
