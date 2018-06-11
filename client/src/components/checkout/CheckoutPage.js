import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Header from './CheckoutHeader';
import Footer from './CheckoutFooter';
import CheckoutDetail from './CheckoutDetail';
import { withRouter } from 'react-router';

class CheckoutPage extends Component {

  render() {
    return (
      <div>
        <Header />
          <Route exact path="/checkout/detail" component={CheckoutDetail} />
        <Footer />
      </div>
    );
  }
}


export default withStyles()(
  withRouter(CheckoutPage)
);
