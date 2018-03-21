import React, { Component } from 'react';
import Graph from './graph';
import axios from 'axios';
import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import LeftPane from '../layouts/leftPane/LeftPane'
import RightPane from '../layouts/rightPane/RightPane'
import Grid from 'material-ui/Grid'

const style = {

    Div: {
        // margin: '2em'
    }
};





class ProjectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            project: {},
            people: []
        };

    }

    loadProjectsFromServer = () => {
        //console.log("loadFromSercer")
        //console.log('http://localhost:3001/api/projects/' + this.props.match.params.id)
        axios.get('http://localhost:3001/api/projects/' + this.props.match.params.id)
            .then(res => {
                this.setState({ project: res.data });
                //console.log("dostal jsme project")

                //call child function
                this.child.loadGraph()

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

    componentDidMount() {
        this.loadProjectsFromServer();
        this.loadPeopleFromServer();
    }
    updateGraphOnServer(xml) {

        axios.put('http://localhost:3001/api/projects/' + this.props.match.params.id, {
            xml: xml
        })
            .then(response => {
                //console.log(response);
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
                    <BreadcrumbsAndButton path={[this.state.project]} />

                    <Grid container>
                        <Grid>
                            <LeftPane project={this.state.project} people={this.state.people} />
                        </Grid>
                        <Grid>
                            <Graph style={{paddingTop: '0.5em'}} project={this.state.project} updateGraphOnServer={this.updateGraphOnServer.bind(this)} ref={instance => { this.child = instance; }} />
                            {/*<RightPane />*/}
                        </Grid>
                    </Grid>


                    <h1>ProjectPage</h1>
                    <p>id: {this.props.match.params.id}</p>



                </div>
            </div>
        );
    }
}

export default ProjectPage;
