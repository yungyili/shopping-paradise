import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Header from './SellHeader';
import Footer from './SellFooter';
import { setLeaveForLogin} from '../../actions/orderActions';
import SellMainPage from './SellMainPage';
import LoginForm from '../LoginForm';

const styles = theme => ({
  root: {
      flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});

class SellPage extends Component {

  handleLeaveForLogin = () => {
    console.log("SellPage: handleLeaveForLogin: path=", this.props.location.pathname);
    this.props.setLeaveForLogin(this.props.location.pathname);
  }

  renderLoginOrLanding = () => {
    const {auth, classes} = this.props;

    if (auth.ongoing){
      return (<div>...</div>)
    } else {
      if (!auth.content){
        return (
          <div className={classes.root}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={4}>
              <Typography
                variant="display3"
                color="inherit"
                className={classes.flex}
                style={{textAlign: 'center'}}
              >
                Sell Whatever You Want
              </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <LoginForm handleLeaveForLogin={this.handleLeaveForLogin} />
              </Grid>
            </Grid>
          </div>


        )
      } else {
        return (<SellMainPage />);
      }
    }
  }

  render() {

    return (
      <div>
        <Header />
          {this.renderLoginOrLanding()}
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    auth: state.auth
  };
}

export default withStyles(styles)(
  withRouter(
    connect(mapStateToProps, {setLeaveForLogin})(SellPage)
  )
);
