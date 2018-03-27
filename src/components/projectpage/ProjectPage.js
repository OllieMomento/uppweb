import React, { Component } from 'react';
import Graph from './graph';
import axios from 'axios';
import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import LeftPane from '../layouts/leftPane/LeftPane'
import RightPane from '../layouts/rightPane/RightPane'
import Grid from 'material-ui/Grid'
import { Router, Route } from 'react-router-dom'
import ShotPage from '../shotpage/ShotPage'
import history from '../../history'


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
        //console.log("loadFromSercer")
        //console.log('http://localhost:3001/api/projects/' + this.props.match.params.id)
        axios.get('http://localhost:3001/api/projects/' + this.props.match.params.id)
            .then(res => {
                this.setState({ project: res.data });
                console.log("dostal jsme project")
                this.setState({ isLoading: false})

                //call child function
                //this.child.loadGraph()



            })
    }

    loadPeopleFromServer = () => {
        //console.log("loadFromSercer")
        //console.log('http://localhost:3001/api/projects/' + this.props.match.params.id)
        axios.get('http://localhost:3001/api/people/')
            .then(res => {
                this.setState({ people: res.data });
                
            })
    }

    componentDidMount = () => {
        this.loadProjectsFromServer();
       /*
        if (this.props.location.state == null) {
            console.log("if")
            this.loadProjectsFromServer();
            
            
        }else{
            console.log("else")
            this.setState({isLoading: false})
            this.setState({ project: this.props.location.state.project });
            console.log(this.state.project)
            //this.child.loadGraph()
        }*/
        this.loadPeopleFromServer();
    }
    updateGraphOnServer(xml, seq) {
        
       

        axios.put('http://localhost:3001/api/projects/' + this.props.match.params.id, {
            xml: xml,
            seq: seq
        })
            .then(response => {
                //console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }



    render() {
  

        console.log("isLoading: "+ this.state.isLoading)
        var graph
        if(!this.state.isLoading){
            graph = <Graph project={this.state.project} updateGraphOnServer={this.updateGraphOnServer.bind(this)} />
        } else{
            graph = <div>Loading Graph</div>
        }


        return (
            <div className="ProjectPage" style={style.Page}>
                <Router history={history}>
                    <Route path="/projects/:id/:shot" render={() => <ShotPage project={this.props.project} />} />
                </Router>



                <Header />
                <BreadcrumbsAndButton project={this.state.project} />

                <div style={style.Container}>
                    <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} />
                    {graph}
                    
                    {/*<RightPane />*/}

                </div>
                <div> footer</div>
            </div>
        );
    }
}

export default ProjectPage;
