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




class ShotNameAndStatus extends Component {

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
       

        var shots = this.props.shots

        console.log("12SHOT")
        console.log(shots)

        var names = shots.map((shot, index)=>{
            let number = shot.name.replace("Shot ", "")
            if(index != shots.length-1){  
                number = number + ', '             
            }          
            
            return number
        })
        
        var caption = 'Shot'
        if(shots.length > 1){
            caption = 'Shots'
        }
        
        

        return (
            <div style={style.Div}>
                <div className="ProjectName">
                    <Typography variant="caption" color="inherit" >
                        {caption}
                    </Typography>
                    <Typography variant="title" color="inherit" >
                        {names}
                    </Typography>
                </div>
                {this.getStatus(this.props.project.status)}




            </div>
        );
    }
}

export default ShotNameAndStatus;
