
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import BuyersPage from './BuyersPage';
import LoginForm from './LoginForm';

const styles = theme => ({
  root: {
    margin: '0 10%',
    marginTop: '3%'
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
          <Route exact path="/category/:id(\w+)" component={BuyersPage} />
          <Route exact path="/login" component={LoginForm} />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
