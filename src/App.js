import React, { Component } from 'react';

import HomepageS from './components/homepage/HomepageS';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProjectPage from './components/projectpage/ProjectPage';
//import mxGraphGridAreaEditor from './components/projectpage/mxGraphGridAreaEditor';
import Test from './components/projectpage/test';

class App extends Component {

  render() {
    return (
      //<HomepageS projects = {this.props.projects}/>
            
      <Router>
        <div>
          <Route exact path="/"  render={()=><HomepageS projects = {this.props.projects}/>}/>

          
          <Route path={"/test"}  render={()=><Test id="Progress1"  ref="Progress1"/> }/>
         
          
          <Route path="/projects/:id" component={ProjectPage} />
        </div>
      </Router>

    );
  }
}

export default App;
