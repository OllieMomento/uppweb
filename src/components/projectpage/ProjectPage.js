import React, { Component } from 'react';
import Test from './test';


class ProjectPage extends Component {
    render() {
        return (
            <div className="ProjectPage">
                <h1>ProjectPage</h1>
                <p>id: {this.props.match.params.id}</p>
                <Test id={this.props.match.params.id}/>
            </div>
        );
    }
}

export default ProjectPage;
