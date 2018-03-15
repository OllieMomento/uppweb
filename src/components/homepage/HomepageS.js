import React, { Component } from 'react';
import { Header, Footer, Subheader } from '../layouts/index';

import ProjectsLists from './ProjectsLists';


const style = {

  Div: {
   margin: '1em'
  }
};



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
        <div style={style.Div}>
          <Subheader
            filterText={this.state.filterText}
            filterUpdate={this.filterUpdate.bind(this)}
          />
          <ProjectsLists
            url={this.props.url}
            filterText={this.state.filterText}
          />
        </div>

        <Footer />
      </div>

    );
  }
}

export default HomepageS;
