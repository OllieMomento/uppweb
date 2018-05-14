import React, { Component } from 'react';

import HomepageS from './components/homepage/HomepageS';
import { Router, Route, withRouter } from "react-router-dom";
import ProjectPage from './components/projectpage/ProjectPage';
import ShotPage from './components/shotpage/ShotPage';
import AssetPage from './components/assetPage/AssetPage';
import history from './history';
//import mxGraphGridAreaEditor from './components/projectpage/mxGraphGridAreaEditor';

import Footer from './components/layouts/Footer'


class App extends Component {

  render() {
    return (
      //<HomepageS projects = {this.props.projects}/>
     // <BrowserRouter>
        <Router history={history}>
          <div>
            <Route exact path="/" render={() => <HomepageS history={history} />} />

            <Route exact path="/projects/:id" component={ProjectPage} />
           
            <Route exact path="/projects/:id/shots/:shot" render={() => <ShotPage project={this.props.project}/>} />  
            <Route exact path="/projects/:id/asset/:asset" render={() => <AssetPage project={this.props.project}/>} />          
            <Route path="/test" component={Footer} />
            

          </div>
        </Router>
    //  </BrowserRouter>

    )
  }
}

export default App;
