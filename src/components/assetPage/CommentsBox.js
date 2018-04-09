import React, { Component } from 'react';
import axios from 'axios';
import CommentList from './CommentList'
import Typography from 'material-ui/Typography';





const style = {

    Div: {
        background:  "rgba(0, 0, 0, 0.04)",
        marginTop: "1em",
        padding: "2em"
    },
    Divdiv: {
        marginBottom: "1em"
    },
    subheading:{
        marginBottom: "1em"
    }

};




class CommentsBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: []
        };
    }


    handleCommentSubmit = (comment) => {
        let asset = this.props.asset
        let comments = asset.comments;
        comment.id = Date.now();
        let newComments = comments.concat([comment]);
        this.setState({ data: newComments });

        asset.comments = newComments
        let assetID = asset.id
        let assets = this.props.project.assets


        let index = assets.findIndex(x => x.id == assetID);
        assets[index].comments = newComments

        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            assets: assets
        }).then(response => {
            //console.log(response);
        })
            .catch(err => {
                console.log(err);
            });
    }
    handleCommentDelete = (id) => {

        let comments = this.props.asset.comments;

        let newComments = comments
            .filter(comment => {
                return (comment.id !== id)
            })


        this.setState({ data: newComments });

        let asset = this.props.asset
        asset.comments = newComments
        let assetID = asset.id
        let assets = this.props.project.assets


        let index = assets.findIndex(x => x.id == assetID);
        assets[index].comments = newComments

        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            assets: assets
        }).then(response => {
            //console.log(response);
        })
            .catch(err => {
                console.log(err);
            });
    }


    render() {

        return (

            <div style={style.Div}>
                <Typography variant="subheading" color="inherit" style={style.subheading}>
                   Implemented Comments in version
                </Typography>

                <CommentList
                    onCommentDelete={this.handleCommentDelete}
                    project={this.props.project}
                    people={this.props.people} />

            </div>
        )
    }
}

export default CommentsBox;