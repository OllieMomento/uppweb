import React, { Component } from 'react';

import HomepageS from './components/homepage/HomepageS';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProjectPage from './components/projectpage/ProjectPage';
//import mxGraphGridAreaEditor from './components/projectpage/mxGraphGridAreaEditor';
import Test2 from './components/projectpage/test2';

class App extends Component {

  render() {
    return (
      //<HomepageS projects = {this.props.projects}/>
            
      <Router>
        <div>
          <Route exact path="/"  render={()=><HomepageS projects = {this.props.projects}/>}/>

          
          <Route path={"/test"}  component={Test2} />
         
          
          <Route path="/projects/:id" component={ProjectPage} />
        </div>
      </Router>

    );
  }
}

export default App;
