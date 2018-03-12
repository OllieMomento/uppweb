import React, { Component } from 'react';

class Test2 extends Component {

  render() {

    var request = new Request('http://localhost:3000/projects/1/todo', {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });

    // Now use it!
    fetch(request).then(function (data) { console.log(data)/* handle response */ });



    return (
      //<HomepageS projects = {this.props.projects}/>
      <div>kokot</div>

    );
  }
}

export default Test2;
