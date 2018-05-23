import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Menu, { MenuItem } from 'material-ui/Menu';
import { BrowserRouter as Link } from "react-router-dom";

const styles = {
  root: {
    height: "50px",

  },
  flex: {
    flex: 1, 
    marginBottom:"10px" 
  }
};

class MenuAppBar extends Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  //auth
  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };
  

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
     

        <AppBar position="static" style={{height:50}}>
          <Toolbar>
            <Link to="/test">
              <Typography variant="title" color="inherit" style={styles.flex}>
                UPP Project Planner
            </Typography>
            </Link>
            {auth && (
              <div style={{marginBottom:"10px"}}>

                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />

                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Sign out</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
     
    );
  }
}


export default MenuAppBar;