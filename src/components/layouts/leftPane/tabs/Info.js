import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

//import SearchBar from 'material-ui-search-bar'



const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    Div: {
        backgroundColor: "#eeeeee",
        padding: "2em"
    },
    Divdiv: {
        marginBottom: "1em"
    }

};




class Info extends Component {



    handleChange = name => event => {
        this.setState({
            //[name]: event.target.value,
        });
    };




    render() {
       // var start = this.props.project.start
        //start = String(start).slice(0, 10)


        return (
            <div style={style.Div} >
                <div style={style.Divdiv}>
                    <Typography variant="caption"  >
                        Description
                </Typography>
                    <Typography variant="body1"  >
                        {this.props.project.desc}
                    </Typography>
                </div>
                <div style={style.Divdiv}>
                    <Typography variant="caption"  >
                        Location
                </Typography>
                    <Typography variant="body1"  >
                        {this.props.project.path}
                    </Typography>
                </div>
                <div style={style.Divdiv}>
                    <TextField
                        id="date"
                        label="Start"
                        type="date"
                        defaultValue="2017-05-24"
                        className="start"
                        disabled
                    />
                </div>
                <div style={style.Divdiv}>
                    <TextField
                        id="date"
                        label="End"
                        type="date"
                        defaultValue="2019-05-22"
                        className="end"
                        disabled
                    />
                </div>



            </div>
        );
    }
}

export default Info;
