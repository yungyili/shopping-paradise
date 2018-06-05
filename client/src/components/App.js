
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import Header from './Header';
import BuyersLanding from './BuyersLanding';
import Footer from './Footer';

class App extends React.Component {
  constructor(props){
    super(props);

  }

  render() {
    const { classes } = this.props;
    console.log("App:ctor:", this.props);
    return (
      <BrowserRouter>
        <div className={classes.root}>
          <Header />
          <Route exact path="/" component={BuyersLanding} />
          <Route exact path="/category/:id(\w+)" component={BuyersLanding} />
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles({})(App));
