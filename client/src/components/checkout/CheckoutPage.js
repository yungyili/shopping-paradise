import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Header from './CheckoutHeader';
import Footer from './CheckoutFooter';
import CheckoutDetail from './CheckoutDetail';
import { withRouter } from 'react-router';

const styles = {
  root: {
    margin: '0',
    marginTop: '3%',
    maxWidth: '900px'
  }
};

class CheckoutPage extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} >
        <Header />
          <Route exact path="/checkout/detail" component={CheckoutDetail} />
        <Footer />
      </div>
    );
  }
}


export default withStyles(styles)(
  withRouter(CheckoutPage)
);
