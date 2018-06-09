import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import BuyersLanding from './BuyersLanding';
import Footer from './Footer';

class BuyersPage extends Component {
  render() {

    return (
      <div>
        <Header />
        <Route exact path="/" component={BuyersLanding} />
        <Route exact path="/category/:id(\w+)" component={BuyersLanding} />
        <Footer />
      </div>
    );
  }
}


export default withStyles()(BuyersPage);