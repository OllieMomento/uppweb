import React, { Component } from 'react';


class ProjectPage extends Component {
    render() {
        return (
            <div className="ProjectPage">
                <h1>ProjectPage</h1>
                <p>id: {this.props.match.params.id}</p>
            </div>
        );
    }
}

export default ProjectPage;
