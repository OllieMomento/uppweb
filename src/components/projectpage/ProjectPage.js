import React, { Component } from 'react';
import Graph from './graph';
import axios from 'axios';


class ProjectPage extends Component {
    render() {
        return (
            <div className="ProjectPage">
                <h1>ProjectPage</h1>
                <p>id: {this.props.match.params.id}</p>
                <Graph id={this.props.match.params.id}/>
            </div>
        );
    }
}

export default ProjectPage;
