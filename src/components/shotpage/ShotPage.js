import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import history from '../../history'
import axios from 'axios';
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





class ShotPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {},
            people: [],
            shotID:"",
            isLoading: true
        };

    }

    loadProjectsFromServer = () => {
        //console.log("loadFromSercer")        
        var url = window.location.href

        var projectURL = url.split("/")[4];
        var shotID = url.split("/")[5];

        this.setState({
            shotID: shotID
        })
        
        axios.get('http://localhost:3001/api/projects/' + projectURL)
            .then(res => {
                this.setState({ project: res.data });
                console.log("dostal jsme project Shot")
                this.setState({ isLoading: false })

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



    render() {

        var leftPane
        if (!this.state.isLoading) {
            leftPane = <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} shotID={this.state.shotID}/>
        } else {
            leftPane = <div>Loading Shot</div>
        }
        
        //console.log(this.props.location.state.project)
        return (
            <div className="ShotPage" style={style.Page}>
                <Header />
                <BreadcrumbsAndButton project={this.state.project} />
                <div style={style.Container}>
                    {leftPane}
                    
                    
                    {/*<RightPane />*/}

                </div>
                

                <div> footer</div>
            </div>
        );
    }
}

export default ShotPage;
