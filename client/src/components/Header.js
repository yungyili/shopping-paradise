import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import {fetchCurrentUser} from '../actions/authActions';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  input: {
    marginRight: 20,
  }
};


class Header extends Component {

  componentDidMount(){
    this.props.fetchCurrentUser();
  }

  renderComponentsOnTheRight() {
    console.log("renderComponentsOnTheRight: auth=", this.props.auth);

    const {auth} = this.props;

    if (auth.ongoing){
      return (<div>...</div>);
    } else {
      if (!auth.content){
        return (<Link to="/login">Login</Link>);
      } else {
        return (<a href="/api/auth/logout">Logout</a>);
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Shopping Paradise
            </Typography>

            <div>
              <SearchIcon className={classes.icon} />
              <input type="text" placeholder="Search.." />
            </div>
            {this.renderComponentsOnTheRight()}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    auth: state.auth
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{fetchCurrentUser})(Header));
