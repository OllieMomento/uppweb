import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import history from '../../history'
import axios from 'axios';
import LeftPane from '../layouts/leftPane/LeftPane'
import Graph from './graph';




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
            shotID: "",
            isLoading: true,
            shots: [],
            shotArray: []
        };

    }
    getSelectedSeq =() => {
        var url = window.location.href
        var shotIDs = url.split("/");

        var shotArray = shotIDs.slice(5, (shotIDs.length-1))
        this.setState({shotArray: shotArray})
       
        var shots = this.state.project.shots.filter( shot =>{
            return shotArray.includes(shot.id.toString())
        })
        console.log("SHOT: !!!!")
        
        this.setState({shots: shots})
        console.log(this.state.shots)
        this.setState({ isLoading: false })
        return shots

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
                
                this.getSelectedSeq()

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

    updateGraphOnServer(xml, seq, shots) {

        axios.put('http://localhost:3001/api/projects/' + this.props.match.params.id, {
            xml: xml,
            seq: seq,
         
        })
            .then(response => {
                //console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }

    updateGraphAssetsOnServer(assetsXML) {

        console.log(this.props.project)

        axios.put('http://localhost:3001/api/projects/' + this.state.project._id, {
            assetsXML: assetsXML,           
         
        })
            .then(response => {
                //console.log(response);
            })
            .catch(err => {
                console.log(err);
            });
    }



    render() {

        var leftPane
        var graph
        if (!this.state.isLoading) {
            leftPane = <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} shots={this.state.shots} />
            graph = <Graph project={this.state.project} updateGraphAssetsOnServer={this.updateGraphAssetsOnServer.bind(this)} shots={this.state.shots} shotArray={this.state.shotArray}/>
        } else {
            leftPane = <div>Loading Shot</div>
            graph = <div>Loading Graph</div>
        }

        //console.log(this.props.location.state.project)
        return (
            <div className="ShotPage" style={style.Page}>
                <Header />
                <BreadcrumbsAndButton project={this.state.project} shots={this.state.shots}/>
                <div style={style.Container}>
                    {leftPane}
                    {graph}

                    {/*<RightPane />*/}

                </div>


                <div> footer</div>
            </div>
        );
    }
}

export default ShotPage;
