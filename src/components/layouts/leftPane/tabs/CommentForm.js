//CommentForm.js
import React, { Component } from 'react';
import dateFormat from 'dateformat'
import Button from 'material-ui/Button'

const style = {
    text: {
        width: '100%',
        padding: '12px 20px',
        margin: '8px 0',
        display: 'inline - block',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box'
    },
    form:{
        marginBottom: "1em",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",

    },
    button:{
       
      flex: "flex-shrink"
    }
}


class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = { author: '5aae90c29398b5351435e90c', text: '' };
    }

    handleTextChange = (e) => {
        this.setState({ text: e.target.value });
    }

    //method that calls parent method to store Comment
    handleSubmit = (e) => {
        e.preventDefault();
        let text = this.state.text.trim();
        if (!text) {
            return;
        }
        var now = new Date();
        let date = dateFormat(now, "mmmm dS, yyyy, h:MM:ss TT");

        this.props.onCommentSubmit({ author: this.state.author, date: date, text: text, id: new Date().valueOf() });
        this.setState({ text: '' });
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit} style={style.form}>

                <input style={style.text}
                    type='text'
                    placeholder='Type your comment...'
                    value={this.state.text}
                    onChange={this.handleTextChange} />
                <Button variant="raised" type="submit" style={style.button}>
                    Comment
                </Button>
            </form>
        )
    }
}

export default CommentForm;