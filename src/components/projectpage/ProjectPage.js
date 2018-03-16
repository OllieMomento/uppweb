import React, { Component } from 'react';
import Graph from './graph';
import axios from 'axios';
import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import LeftPane from '../layouts/leftPane/LeftPane'


const style = {

    Div: {
     margin: '2em'
    }
  };
  




class ProjectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {}
        };

    }

    loadProjectsFromServer = () => {
        console.log("loadFromSercer")
        console.log('http://localhost:3001/api/projects/' + this.props.match.params.id)
        axios.get('http://localhost:3001/api/projects/' + this.props.match.params.id)
            .then(res => {
                this.setState({ data: res.data });
                console.log("dostal jsme data")

                //call child function
                this.child.loadGraph()

            })
    }

    componentDidMount() {
        this.loadProjectsFromServer();
    }
    updateGraphOnServer(xml) {

        axios.put('http://localhost:3001/api/projects/' + this.props.match.params.id, {
            xml: xml
        })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }



    render() {
        return (
            <div className="ProjectPage">
                <Header />
                <div style={style.Div}>
                    <BreadcrumbsAndButton />
                    <LeftPane project={this.state.data}/>

                    <h1>ProjectPage</h1>
                    <p>id: {this.props.match.params.id}</p>


                    <Graph project={this.state.data} updateGraphOnServer={this.updateGraphOnServer.bind(this)} ref={instance => { this.child = instance; }} />
                </div>
            </div>
        );
    }
}

export default ProjectPage;
