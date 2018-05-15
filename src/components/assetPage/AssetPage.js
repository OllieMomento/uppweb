import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import axios from 'axios';
import LeftPane from '../layouts/leftPane/LeftPane'
import RightPane from '../assetPage/RightPane'



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


class AssetPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: {},
            people: [],
            isLoading: true,
            asset: "",

        };

    }

    //Get asset id form URL
    getAsset = () => {
        var url = window.location.href
        var assetID = url.split("/")[6]       
      

        var asset = this.state.project.assets.filter(asset => { 
            return asset.id === parseInt(assetID, 10)
        })

  
        this.setState({ asset: asset[0] })
        this.setState({ isLoading: false })
        return asset

    }
    //Update asset method for children component
    updateAsset(asset){
        this.setState({
            asset: asset
        })
    }


    //Get data from server based on project ID
    loadProjectsFromServer = () => {
            
        var url = window.location.href

        var projectURL = url.split("/")[4];

        axios.get('http://localhost:3001/api/projects/' + projectURL)
            .then(res => {
                this.setState({ project: res.data });              

                this.getAsset()

            })
    }

    
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

    //Update graph XML in project data
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

    //Update graph asset XML in project data
    updateGraphAssetsOnServer(assetsXML) {      

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
        var rightPane
        var bread
        if (!this.state.isLoading) {

            leftPane = <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} shots={null} asset={this.state.asset} />
            rightPane = <RightPane project={this.state.project} people={this.state.people} asset={this.state.asset} updateAsset={this.updateAsset.bind(this)}/>
            bread = <BreadcrumbsAndButton project={this.state.project} shots={this.state.project.shots} asset={this.state.asset} />

        } else {
            leftPane = <div>Loading Shot</div>
            rightPane = <div></div>
        }


        //console.log(this.props.location.state.project)
        return (

            <div className="ShotPage" style={style.Page}>
                <Header />
                {bread}
                <div style={style.Container}>
                    {leftPane}
                    {rightPane}
                </div>

             
            </div>
        );
    }
}

export default AssetPage;