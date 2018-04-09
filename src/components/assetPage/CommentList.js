//CommentList.js
import React, { Component } from 'react';
import Comment from './Comment';


class CommentList extends Component {

    render() {
        let commentNodes = this.props.project.comments.map((comment, index) => {

            return (
                <Comment
                    onCommentDelete={this.props.onCommentDelete}
                    onCommentUpdate={this.props.onCommentUpdate}
                    key={index}
                    comment={comment}
                    people={this.props.people}
                />
            )
        })
        return (
            <div >
                {commentNodes}
            </div>
        )
    }
}

export default CommentList;