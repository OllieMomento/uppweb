import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
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
    // get selected shots
    getSelectedSeq = () => {
        var url = window.location.href
        var shotIDs = url.split("/");

        var shotArray = shotIDs[6].split("_")

        this.setState({ shotArray: shotArray })

        var shots = this.state.project.shots.filter(shot => {
            return shotArray.includes(shot.id.toString())
        })

        this.setState({ shots: shots })
        this.setState({ isLoading: false })
        return shots

    }

    //load project from server
    loadProjectsFromServer = () => {
        //console.log("loadFromSercer")        
        var url = window.location.href

        var projectURL = url.split("/")[4];
        var shotID = url.split("/")[6];

        this.setState({
            shotID: shotID
        })

        axios.get('http://localhost:3001/api/projects/' + projectURL)
            .then(res => {
                this.setState({ project: res.data });              

                this.getSelectedSeq()

            })
    }

    //get people from project
    loadPeopleFromServer = () => {
        axios.get('http://localhost:3001/api/people/')
            .then(res => {
                this.setState({ people: res.data });

            })
    }

    componentDidMount() {
        this.loadProjectsFromServer();
        this.loadPeopleFromServer();
    }

    //update graph XML, Seq on server
    updateGraphOnServer(xml, seq, shots) {

        axios.put('http://localhost:3001/api/projects/' + this.props.match.params.id, {
            xml: xml,
            seq: seq,

        })
            .then(response => {
                //console.log(response);
            }).then(respones => {               
            })
            .catch(err => {
                console.log(err);
            });
    }

    //update assetXML, assets on server
    updateGraphAssetsOnServer(assetsXML, assets) {

        axios.put('http://localhost:3001/api/projects/' + this.state.project._id, {
            assetsXML: assetsXML,
            assets: assets

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
        
            leftPane = <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} shots={this.state.shots} asset={null} />
            graph = <Graph project={this.state.project} updateGraphAssetsOnServer={this.updateGraphAssetsOnServer.bind(this)} shots={this.state.shots} shotArray={this.state.shotArray} people={this.state.people} />
        } else {
            leftPane = <div>Loading Shot</div>
            graph = <div>Loading Graph</div>
        }

        return (
            <div className="ShotPage" style={style.Page}>
                <Header />
                <BreadcrumbsAndButton project={this.state.project} shots={this.state.shots} />
                <div style={style.Container}>
                    {leftPane}
                    {graph}

                </div>

                <div>_</div>
            </div>
        );
    }
}

export default ShotPage;
