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
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
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

  onLogin = () => {
    this.props.history.push('/login');
  }

  renderLoginButton(){
    console.log("renderLoginButton: auth=", this.props.auth);
    const {auth, classes} = this.props;

    if (auth.ongoing){
      return (<Button className={classes.button}>...</Button>);
    } else {
      if (!auth.content){
        return (<IconButton className={classes.button} onClick={this.onLogin}><PersonIcon /></IconButton>)
      } else {
        return ([
          <IconButton className={classes.button} aria-label="Shopping Cart"><ShoppingCartIcon /></IconButton>,
          <IconButton className={classes.button} onClick={()=>this.props.logout()}><ExitToAppIcon /></IconButton>
        ]);
      }
    }
  }

  renderComponentsOnTheRight() {
    const {classes} = this.props;
    return (
      <div>
        <Button className={classes.button} to={"/sell"} component={this.LinkWrapper}>Sell</Button>
        {this.renderLoginButton()}
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.header}>
        <AppBar>
          <Toolbar>
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
