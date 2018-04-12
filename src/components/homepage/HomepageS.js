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
      data: ""

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

  componentDidMount() {
    this.loadProjectsFromServer();
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

    return (
      <div className="HomepageS">
        <Header />
        <div style={style.Div}>
          <Subheader
            filterText={this.state.filterText}
            filterUpdate={this.filterUpdate.bind(this)}
            loadProjectsFromServer={this.loadProjectsFromServer}
          />
        {projectList}
        </div>

        <Footer />
      </div>

    );
  }
}

export default HomepageS;
