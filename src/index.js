import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import projects from './data/projects'
import CommentBox from './CommentBox';

/*
//<App projects={projects}/>,
ReactDOM.render(<CommentBox
    url='http://localhost:3001/api/comments'
    pollInterval={2000} />, document.getElementById('root'));
//registerServiceWorker();
*/

ReactDOM.render(<App />, document.getElementById('root'));
