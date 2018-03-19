import React, { Component } from 'react';
import axios from 'axios';
import CommentList from './CommentList'
import CommentForm from './CommentForm'

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




class CommentsBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: []
        };
    }


    handleCommentSubmit = (comment) => {
        let comments = this.props.project.comments;
        comment.id = Date.now();
        let newComments = comments.concat([comment]);
        this.setState({ data: newComments });
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
    handleCommentDelete = (id) => {

        let comments = this.props.project.comments;
        
        let newComments = comments
        .filter(comment =>{
            return( comment.id !== id )
        })


        this.setState({ data: newComments });
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


    render() {

        return (

            <div style={style.Div}>
                <CommentList
                    onCommentDelete={this.handleCommentDelete}
                    project={this.props.project}
                    people={this.props.people} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        )
    }
}

export default CommentsBox;