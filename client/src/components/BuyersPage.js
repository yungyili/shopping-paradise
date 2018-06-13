import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Header from './Header';
import BuyersLanding from './BuyersLanding';
import Item from './Item';
import Footer from './Footer';
import {setLeaveForLogin} from '../actions/orderActions';
import { LEAVE_FOR_LOGIN } from '../constants/orders';

const styles = theme => ({

});

class BuyersPage extends Component {
  componentDidMount(){
    const path = this.props.order.leaveForLogin;
    const pathInCookie = localStorage.getItem(LEAVE_FOR_LOGIN);

    if (path || pathInCookie){
      this.props.history.push(path? path: pathInCookie);
      this.props.setLeaveForLogin(null);
    }
  }
  
  render() {

    return (
      <div>
        <Header />
        <Route exact path="/" component={BuyersLanding} />
        <Route exact path="/#" component={BuyersLanding} />
        <Route exact path="/category/:id(\w+)" component={BuyersLanding} />
        <Route exact path="/item/:id(\w+)" component={Item} />
        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    order: state.order
  };
}

export default withStyles(styles)(
  withRouter(
    connect(mapStateToProps,{setLeaveForLogin})(BuyersPage)
  )
);
