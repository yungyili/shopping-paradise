
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import BuyersPage from './BuyersPage';
import LoginForm from './LoginForm';
import CheckoutPage from './checkout/CheckoutPage';
import SellPage from './sell/SellPage';
import BuyerWorkspaceMainPage from './buy/BuyerWorkspaceMainPage';

const styles = theme => ({
  root: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
});

class App extends React.Component {
  render() {
    const { classes } = this.props;
    console.log("App:ctor:", this.props);
    return (
      <BrowserRouter>
        <div className={classes.root} >
          <Route exact path="/" component={BuyersPage} />
          <Route exact path="/#" component={BuyersPage} />
          <Route exact path="/category/:id(\w+)" component={BuyersPage} />
          <Route exact path="/item/:id(\w+)" component={BuyersPage} />
          <Route exact path="/login" component={LoginForm} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/sell" component={SellPage} />
          <Route path="/buy" component={BuyerWorkspaceMainPage} />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
