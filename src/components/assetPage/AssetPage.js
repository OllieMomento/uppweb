import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'
import history from '../../history'
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
   
       getAsset =() => {
        var url = window.location.href
        var assetID = url.split("/")[6]
       
        var asset = this.state.project.assets.filter( asset =>{
            return asset.id === parseInt(assetID)
        })      
        console.log(asset[0])
        this.setState({asset: asset[0]})
        this.setState({ isLoading: false })
        return asset

    }


    loadProjectsFromServer = () => {
        //console.log("loadFromSercer")        
        var url = window.location.href

        var projectURL = url.split("/")[4];

        axios.get('http://localhost:3001/api/projects/' + projectURL)
            .then(res => {
                this.setState({ project: res.data });               
                console.log("dostal jsme project Shot")
                
                this.getAsset()

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
        var rightPane
        var graph
        if (!this.state.isLoading) {
            leftPane = <LeftPane style={style.LeftPane} project={this.state.project} people={this.state.people} shots={null} asset={this.state.asset}/>
            rightPane = <RightPane project={this.state.project} people={this.state.people} asset={this.state.asset}/>

        } else {
            leftPane = <div>Loading Shot</div>
            rightPane = <div></div>
        }

        //console.log(this.props.location.state.project)
        return (
            <div className="ShotPage" style={style.Page}>
                <Header />
                <BreadcrumbsAndButton project={this.state.project} shots={this.state.shots}/>
                <div style={style.Container}>
                    {leftPane}
                    {rightPane}

                    

                </div>

                <div> footer</div>
            </div>
        );
    }
}

export default AssetPage;