import React, { Component } from 'react';

import Header from '../layouts/Header'
import BreadcrumbsAndButton from '../layouts/BreadcrumbsAndButton'




const style = {
    Page:{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'

    },
    Container: {
        display: 'flex',
        flexGrow: '1',

    },

    Div: {
        display: 'flex',
        flexDirection: 'column',
        
    },
    LeftPane: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: '1'
    }

};





class ShotPage extends Component {

  



    render() {
        return (
            <div className="ProjectPage" style={style.Page}>
                <Header />
               
                                   
                <div> footer</div>
            </div>
        );
    }
}

export default ShotPage;
