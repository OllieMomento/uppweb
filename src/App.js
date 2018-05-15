import React, { Component } from 'react';

import HomepageS from './components/homepage/HomepageS';
import { Router, Route } from "react-router-dom";
import ProjectPage from './components/projectpage/ProjectPage';
import ShotPage from './components/shotpage/ShotPage';
import AssetPage from './components/assetPage/AssetPage';
import history from './history';


class App extends Component {

  render() {
    return (
        <Router history={history}>
          <div>
            <Route exact path="/" render={() => <HomepageS history={history} />} />
            <Route exact path="/projects/:id" component={ProjectPage} />           
            <Route exact path="/projects/:id/shots/:shot" render={() => <ShotPage project={this.props.project}/>} />  
            <Route exact path="/projects/:id/asset/:asset" render={() => <AssetPage project={this.props.project}/>} />        
          </div>
        </Router>
    )
  }
}

export default App;
