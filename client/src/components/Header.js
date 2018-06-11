import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import {fetchCurrentUser, logout} from '../actions/authActions';

const styles = {
  header: {
    flexGrow: 1
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
  },
  button: {
    color: 'white'
  }
};


class Header extends Component {

  componentDidMount(){
    this.props.fetchCurrentUser();
  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  renderComponentsOnTheRight() {
    console.log("renderComponentsOnTheRight: auth=", this.props.auth);

    const {auth, classes} = this.props;

    if (auth.ongoing){
      return (<div>...</div>);
    } else {
      if (!auth.content){
        return (<Button className={classes.button} to={"/login"} component={this.LinkWrapper}>Login</Button>)
      } else {
        return (<Button className={classes.button} onClick={()=>this.props.logout()}>Logout</Button>);
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <AppBar>
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>

            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
              onClick={()=>{this.props.history.push('/')}}
            >
              Shopping Paradise
            </Typography>

            <div>
              <SearchIcon className={classes.icon} />
              <input type="text" placeholder="Search.." />
            </div>
            {this.renderComponentsOnTheRight()}
          </Toolbar>
        </AppBar>
        <div style={{ paddingTop: 64 }}></div>
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
  connect(mapStateToProps,{fetchCurrentUser, logout})(
    withRouter(Header)
  ));
