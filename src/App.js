import React, { Component } from 'react';

import HomepageS from './components/homepage/HomepageS';
import { Router, Route, withRouter } from "react-router-dom";
import ProjectPage from './components/projectpage/ProjectPage';
import ShotPage from './components/shotpage/ShotPage';
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
            <Route exact path="/" render={() => <HomepageS url='http://localhost:3001/api/projects'
              pollInterval={2000} />} />

            <Route exact path="/projects/:id" component={ProjectPage} />
            <Route path="/projects/:id/:shot" render={() => <ShotPage project={this.props.project}/>} />
            <Route path="/test" component={Footer} />

          </div>
        </Router>
    //  </BrowserRouter>

    )
  }
}

export default App;
