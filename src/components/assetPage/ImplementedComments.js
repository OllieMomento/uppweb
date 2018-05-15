import React, { Component } from 'react';
import Typography from 'material-ui/Typography';


const style = {

    Div: {
        background: "rgba(0, 0, 0, 0.04)",
        marginTop: "1em",
        padding: "2em"
    },
    Divdiv: {
        marginBottom: "1em"
    },
    subheading: {
        marginBottom: "1em"
    }

};



class ImplementedComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: []
        };
    }

    render() {

        //Get implementedComments in version
        var implementedComments = []
        if (this.props.selectedVersion.commentsImplemented != null) {
            implementedComments = this.props.selectedVersion.commentsImplemented.map(commentImplemented => {

                var commentsRender = this.props.asset.comments.filter(comment => {             
                    return (comment.id === commentImplemented)
                })
                return (commentsRender[0])
            })
        }


        return (

            <div style={style.Div}>
                <Typography variant="subheading" color="inherit" style={style.subheading}>
                    Implemented Comments in version
                </Typography>

                {implementedComments.map(comment => {
                    if (comment == null) {
                        return (<Typography variant="body1" color="inherit">
                            Comment was deleted
                        </Typography>)
                    } else {
                        return (<Typography key={comment.id} variant="body1" color="inherit">
                            {comment.text}
                        </Typography>)
                    }

                })}

            </div>
        )
    }
}

export default ImplementedComments;