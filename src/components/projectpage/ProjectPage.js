import React, { Component } from 'react';
import Graph from './graph';
import axios from 'axios';
import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import LeftPane from '../layouts/leftPane/LeftPane'


const style = {
    Page: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'

    },
    Container: {
        display: 'flex',
        flexGrow: '1',

    },

    Div: {
        display: 'flex',
        flexDirection: 'column',

    },
    LeftPane: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: '1'
    }

};





class ProjectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {},
            people: [],
            isLoading: true
        };

    }

    loadProjectsFromServer = () => {
       
        axios.get('http://localhost:3001/api/projects/' + this.props.match.params.id)
            .then(res => {
                this.setState({ project: res.data });
                
                this.setState({ isLoading: false })            

            })
    }

    loadPeopleFromServer = () => {
       
        axios.get('http://localhost:3001/api/people/')
            .then(res => {
                this.setState({ people: res.data });

            })
    }

    componentDidMount = () => {
        this.loadProjectsFromServer();
        this.loadPeopleFromServer();
    }

    updateGraphOnServer = (xml, shots) => {
                axios.put('http://localhost:3001/api/projects/' + this.props.match.params.id, {
            xml: xml,           
            shots: shots

        })
            .then(response => {
                
            })
            .catch(err => {
                console.log(err);
            });
    }



    render() {
        var graph
        if (!this.state.isLoading) {
            graph = <Graph project={this.state.project} updateGraphOnServer={this.updateGraphOnServer.bind(this)} />
        } else {
            graph = <div>Loading Graph</div>
        }


        return (
            <div className="ProjectPage" style={style.Page}>    

                <Header />
                <BreadcrumbsAndButton project={this.state.project} />

                <div style={style.Container}>
                    <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} shots={null} asset={null}/>
                    {graph}          

                </div>
                <div>_  </div>
            </div>
        );
    }
}

export default ProjectPage;
