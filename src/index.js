import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import projects from './data/projects'

ReactDOM.render(<App projects={projects}/>, document.getElementById('root'));
registerServiceWorker();
