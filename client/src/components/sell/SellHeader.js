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
import {fetchCurrentUser, logout} from '../../actions/authActions';
import {setLeaveForLogin} from '../../actions/orderActions';

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


class SellHeader extends Component {

  componentDidMount(){
    this.props.fetchCurrentUser();
  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  onLogin = () => {
    this.props.setLeaveForLogin(this.props.location.pathname);
    this.props.history.push('/login');
  }

  renderLoginButton(){
    console.log("renderLoginButton: auth=", this.props.auth);
    const {auth, classes} = this.props;

    if (auth.ongoing){
      return (<Button className={classes.button}>...</Button>);
    } else {
      if (!auth.content){
        return null;
      } else {
        return (<Button className={classes.button} onClick={()=>this.props.logout()}>Logout</Button>);
      }
    }
  }

  renderComponentsOnTheRight() {
    const {classes} = this.props;
    return (
      <div>
        <Button className={classes.button} to={"/"} component={this.LinkWrapper}>buy</Button>
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
              onClick={()=>{this.props.history.push('/sell')}}
            >
              Shopping Paradise
            </Typography>

            {this.renderComponentsOnTheRight()}
          </Toolbar>
        </AppBar>
        <div style={{ paddingTop: 64 }}></div>
      </div>
    );
  }
}

SellHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    auth: state.auth
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{fetchCurrentUser, setLeaveForLogin, logout})(
    withRouter(SellHeader)
  ));
