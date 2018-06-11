import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import BuyersLanding from './BuyersLanding';
import Item from './Item';
import Footer from './Footer';

const styles = theme => ({

});

class BuyersPage extends Component {
  render() {

    return (
      <div>
        <Header />
        <Route exact path="/" component={BuyersLanding} />
        <Route exact path="/category/:id(\w+)" component={BuyersLanding} />
        <Route exact path="/item/:id(\w+)" component={Item} />
        <Footer />
      </div>
    );
  }
}


export default withStyles(styles)(BuyersPage);
