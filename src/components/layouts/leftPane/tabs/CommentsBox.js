import React, { Component } from 'react';
import axios from 'axios';
import CommentList from './CommentList'
import CommentForm from './CommentForm'


const style = {
    SearchBar: {
        marginLeft: 15,
        maxWidth: 800

    },
    Div: {
        backgroundColor: "#eeeeee",
        padding: "2em",

    },
    Divdiv: {
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

    //Update PROJECT comment on server
    handleCommentSubmitProject = (comment) => {
        let comments = this.props.project.comments.reverse();
        comment.id = Date.now();
        let newComments = comments.concat([comment]).reverse();
        this.setState({ comments: newComments });        
        this.props.project.comments = newComments


        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            comments: newComments
        }).then(response => {
            //console.log(response);
        })
            .catch(err => {
                console.log(err);
            });
    }

    //Update ASSET comment on server
    handleCommentSubmitAsset = (comment) => {
        let comments = this.props.asset.comments.reverse();
        comment.id = Date.now();
        let newComments = comments.concat([comment]).reverse();
        this.setState({ comments: newComments });

        let asset = this.props.asset
        asset.comments = newComments
        let assetID = asset.id
        let assets = this.props.project.assets


        let index = assets.findIndex(x => x.id === assetID);
        this.props.project.assets[index].comments = newComments



        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            assets: assets
        }).then(response => {
            //console.log(response);
        })
            .catch(err => {
                console.log(err);
            });
    }


    //PROJECT or ASSET comment
    handleCommentSubmit = (comment) => {
        if (this.props.asset != null) {
            this.handleCommentSubmitAsset(comment)

        } else {
            this.handleCommentSubmitProject(comment)
        }
    }

    //delete ASSET comment from server
    handleCommentDeleteAsset = (id) => {
        let comments = this.props.asset.comments;

        let newComments = comments
            .filter(comment => {
                return (comment.id !== id)
            })

        this.setState({ comments: newComments });
        let asset = this.props.asset
        asset.comments = newComments
        let assetID = asset.id
        let assets = this.props.project.assets


        let index = assets.findIndex(x => x.id === assetID);
        this.props.project.assets[index].comments = newComments



        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            assets: assets
        }).then(response => {
            //console.log(response);
        })
            .catch(err => {
                console.log(err);
            });

    }

    //delete PROJECT comment from server
    handleCommentDeleteProject = (id) => {

         let comments = this.props.project.comments;

        let newComments = comments
            .filter(comment => {
                return (comment.id !== id)
            })

        this.setState({ comments: newComments });
        let project = this.props.project
        project.comments = newComments

        axios.put('http://localhost:3001/api/projects/' + this.props.project._id, {
            comments: newComments
        }).then(response => {
            //console.log(response);
        })
            .catch(err => {
                console.log(err);
            });

    }

    //PROJECT or ASSET comment
    handleCommentDelete = (id) => {

        if (this.props.asset != null) {
            this.handleCommentDeleteAsset(id)

        } else {
            this.handleCommentDeleteProject(id)
        }
    }

    render() {
        return (
            <div style={style.Div}>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <CommentList
                    onCommentDelete={this.handleCommentDelete}
                    project={this.props.project}
                    people={this.props.people}
                    asset={this.props.asset} />

            </div>
        )
    }
}

export default CommentsBox;