import React, { Component } from 'react';

import HomepageS from './components/homepage/HomepageS';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProjectPage from './components/projectpage/ProjectPage';
//import mxGraphGridAreaEditor from './components/projectpage/mxGraphGridAreaEditor';


class App extends Component {

  render() {
    return (
      //<HomepageS projects = {this.props.projects}/>

      <Router>
        <div>
          <Route exact path="/" render={() => <HomepageS url='http://localhost:3001/api/projects'
            pollInterval={2000} />} />


          <Route path="/projects/:id" component={ProjectPage} />
        </div>
      </Router>

    );
  }
}

export default App;
