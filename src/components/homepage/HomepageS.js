import React, { Component } from 'react';
import { Header, Footer, Subheader } from '../layouts/index';

import ProjectsLists from './ProjectsLists';



class HomepageS extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filterText: ''

    }
  }
  filterUpdate(value) {
    this.setState({
      filterText: value
    })
  }



  render() {
    //console.log('filterText state from parent component', this.state.filterText)

    return (
      <div className="HomepageS">
        <Header />
        <Subheader
          filterText={this.state.filterText}
          filterUpdate={this.filterUpdate.bind(this)}
        />
        <ProjectsLists
          url={this.props.url}
          filterText={this.state.filterText}
        />
        <Footer />
      </div>

    );
  }
}

export default HomepageS;
