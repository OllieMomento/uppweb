import React, { Component } from 'react';
import Typography from 'material-ui/Typography';

import marked from 'marked';

const style = {
  firstRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  pendingComment: {
    padding: '1em'

  },
  doneComment: {
    background: "#81C784",
    padding: '1em'
  },
  deleteAndText:{
    display: "flex",
    justifyContent: "space-between"
  }
}




class Comment extends Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      toBeUpdated: false,
      isHovering: false,

    };
  }
  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }
  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  updateComment = (e) => {
    e.preventDefault();
    //brings up the update field when we click on the update link.
    this.setState({ toBeUpdated: !this.state.toBeUpdated });
  }
  handleCommentUpdate = (e) => {
    e.preventDefault();
    let id = this.props.uniqueID;
    //if author or text changed, set it. if not, leave null and our PUT request
    //will ignore it.
    let author = (this.state.author) ? this.state.author : null;
    let text = (this.state.text) ? this.state.text : null;
    let comment = { author: author, text: text };
    this.props.onCommentUpdate(id, comment);
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      author: '',
      text: ''
    })
  }
  deleteComment = (e) => {
    e.preventDefault();
    let id = this.props.comment.id

    this.props.onCommentDelete(id);

  }

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleAuthorChange = (e) => {
    this.setState({ author: e.target.value });
  }

  rawMarkup() {
    let rawMarkup = marked(this.props.children.toString());
    return { __html: rawMarkup };
  }

  getNameFromID(id) {
    const name = this.props.people
      .filter(human => {
        return human._id === id
      }).map(human => {
        return (
          human.name
        )
      })
    return (name)
  }

  
  render() {
    var commentStyle = style.pendingComment
    var textVersion = ""
    if (this.props.asset != null) {

      this.props.asset.versions.map(version => {
        version.commentsImplemented.map(commentID => {
          if (commentID === this.props.comment.id) {
            commentStyle = style.doneComment
            textVersion = version.name

          }
          return ""
        })
        return ""
      })
    }


    if (textVersion !== "") {
      var deleteButt =
        <div style={style.deleteAndText}>
          <Typography variant="caption" color="inherit" style={style.delete}>
            <a href='button' onClick={this.deleteComment}>delete</a>
          </Typography>
          <Typography variant="caption" color="inherit" style={style.delete}>
            Implemented in: {textVersion}
          </Typography>
        </div>
    }
    else {
      deleteButt = <Typography variant="caption" color="inherit" style={style.delete}>
        <a href='button' onClick={this.deleteComment}>delete</a>
      </Typography>

    }
    return (
      <div >
        <div style={commentStyle}
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}>
          <div style={style.firstRow}>
            <Typography variant="caption" color="inherit" >
              {this.getNameFromID(this.props.comment.author)}
            </Typography>
            <Typography variant="caption" color="inherit">
              {this.props.comment.date}
            </Typography>
          </div>

          <Typography variant="body1" color="inherit">
            {this.props.comment.text}
          </Typography>
          {deleteButt}
        </div>

      </div>
    )
  }
}

export default Comment;