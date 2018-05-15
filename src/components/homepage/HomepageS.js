import React, { Component } from 'react';

import Header from '../layouts/Header';
import Toolbar from '../layouts/Toolbar';
import ProjectsLists from './ProjectsLists';
import axios from 'axios';

const style = {

  Div: {
    margin: '2em',
    marginTop: '1em'
  }
};



class HomepageS extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filterText: '',
      url: 'http://localhost:3001/api/projects',
      data: "",
      people: ""

    }
  }
  //Search bar filtering
  filterUpdate(value) {
    this.setState({
      filterText: value
    })
  }

  //Get project data from server
  loadProjectsFromServer = () => {
    var url = 'http://localhost:3001/api/projects'
    axios.get(url)
      .then(res => {
        this.setState({ data: res.data });
      })
  }
  //Get people data from server
  loadPeopleFromServer = () => {
    axios.get('http://localhost:3001/api/people/')
        .then(res => {
            this.setState({ people: res.data });

        })
}

  componentDidMount() {
    this.loadProjectsFromServer();
    this.loadPeopleFromServer()
}



  render() {

    //Condition if projects data is not loaded
    var projectList    
    if (this.state.data !== "") {
      projectList =<ProjectsLists
        url={this.props.url}
        filterText={this.state.filterText}
        data={this.state.data}
        
      />
    }else{
      projectList = "Loading"
    }

    //Condition if people data is not loaded
    var toolbar    
    if(this.state.people !== "") {
      toolbar = <Toolbar
            filterText={this.state.filterText}
            filterUpdate={this.filterUpdate.bind(this)}
            loadProjectsFromServer={this.loadProjectsFromServer}
            people={this.state.people}
          />
    }else{
      toolbar = "Loading"
    }

    return (
      <div className="HomepageS">
        <Header />
        <div style={style.Div}>
          {toolbar}
          {projectList}
        </div>       
      </div>
    );
  }
}

export default HomepageS;
