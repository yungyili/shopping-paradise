import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import MediaQuery from 'react-responsive';
import {fetchCurrentUser, logout} from '../actions/authActions';

const styles = {
  header: {
    color: 'white',
    marginBottom: '2em'
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
  },
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

  renderSellButton = () => {
    const {classes} = this.props;
    return (
      <Button className={classes.button} to={"/sell"} component={this.LinkWrapper}>Sell</Button>
    );
  }

  renderShoppingCart = () => {
    const {classes} = this.props;
    return (
      <IconButton
        key={0} className={classes.button} aria-label="Shopping Cart"
        to={"/buy"} component={this.LinkWrapper}
      >
        <ShoppingCartIcon />
      </IconButton>
    );
  }

  renderLoginOutButton = () => {
    console.log("renderLoginOutButton: auth=", this.props.auth);
    const {auth, classes} = this.props;

    if (auth.ongoing){
      return (<Button className={classes.button}>...</Button>);
    } else {
      if (!auth.content){
        return (<IconButton className={classes.button} onClick={this.onLogin}><PersonIcon /></IconButton>)
      } else {
        return (<IconButton className={classes.button} onClick={()=>this.props.logout()}><ExitToAppIcon /></IconButton>);
      }
    }
  }

  renderUser = () => {
    const { classes, auth } = this.props;

    var userName = '';
    try {
      if (typeof auth.content.name === "string"){
        userName = auth.content.name;
      }
    } catch (err) {
      userName = '';
    }

    if (userName){
      return (
        <div>
          <Grid container spacing={0}>
            <Grid item>
              <PersonIcon />
            </Grid>
            <Grid item>
              <Typography
              variant="title"
              color="inherit"
              >
                {userName}
              </Typography>
            </Grid>
          </Grid>
        </div>
      )
    } else {
      return <div></div>;
    }
  }

  applyMediaQuery = (Component, styles) => {
    return (
      <div>
        <MediaQuery minWidth={601}>
          <Component style={styles.sm}/>
        </MediaQuery>
        <MediaQuery maxWidth={600}>
          <Component style={styles.xs}/>
        </MediaQuery>
      </div>
    );
  }

  renderComponentsOnTheLeft = () => {
    const { classes } = this.props;

    const Component = (props) => (
        <Typography
          variant="title"
          color="inherit"
          className={classes.flex}
          onClick={()=>{this.props.history.push('/')}}
          style={props.style}
        >
          Shopping Paradise
        </Typography>
    );

    return this.applyMediaQuery(Component, {
      xs:{
        textAlign: 'center',
        paddingTop: '1em'
      },
      sm:{
        marginLeft: '1em'
      },
    });
  }

  renderComponentsOnTheRight = () => {
    const Component = (props) =>  (
      <Grid container spacing={16}
        style={props.style}
      >
        <Grid item>
          {this.renderUser()}
        </Grid>
        <Grid item>
          {this.renderSellButton()}
        </Grid>
        <Grid item>
          {this.renderShoppingCart()}
        </Grid>
        <Grid item>
          {this.renderLoginOutButton()}
        </Grid>
      </Grid>
    );

    return this.applyMediaQuery(Component, {
      xs:{
        direction: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      sm:{
        direction: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: '1em'
      },
    });

  }

  render() {
    const { classes, auth } = this.props;
    const { theme } = this.props;
    const primaryColor = theme.palette.primary.main;

    return (
      <div style={{backgroundColor: primaryColor}} className={classes.header}>
        <Grid container spacing={16}
          direction="row"
          justify="flex-end"
          alignItems="center"
        >
          <Grid item xs={12} sm={6}>
            {this.renderComponentsOnTheLeft()}
          </Grid>
          <Grid item xs={12} sm={6}>
            {this.renderComponentsOnTheRight()}
          </Grid>
        </Grid>
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
    withRouter(withTheme()(Header))
  ));
