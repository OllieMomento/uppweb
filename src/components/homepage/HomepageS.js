import React, { Component } from 'react';
import { Header, Footer, Subheader } from '../layouts/index';

import ProjectsLists from './ProjectsLists';
import axios from 'axios';

const style = {

  Div: {
    margin: '1em'
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
  filterUpdate(value) {
    this.setState({
      filterText: value
    })
  }

  loadProjectsFromServer = () => {
    console.log("LOAD PROJECT")
    var url = 'http://localhost:3001/api/projects'
    axios.get(url)
      .then(res => {
        this.setState({ data: res.data });
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
    this.loadPeopleFromServer()
    //setInterval(this.loadProjectsFromServer, this.props.pollInterval);
}



  render() {
    //console.log('filterText state from parent component', this.state.filterText)
    console.log("DATAA")
    console.log(this.state.data)
    var projectList
    if (this.state.data != "") {
      projectList =<ProjectsLists
        url={this.props.url}
        filterText={this.state.filterText}
        data={this.state.data}
        
      />
    }else{
      projectList = "Loading"
    }
    var subheader
    if(this.state.people != "") {
      subheader = <Subheader
            filterText={this.state.filterText}
            filterUpdate={this.filterUpdate.bind(this)}
            loadProjectsFromServer={this.loadProjectsFromServer}
            people={this.state.people}
          />
    }else{
      subheader = "Loading"
    }

    return (
      <div className="HomepageS">
        <Header />
        <div style={style.Div}>
          {subheader}
        {projectList}
        </div>

        <Footer />
      </div>

    );
  }
}

export default HomepageS;
