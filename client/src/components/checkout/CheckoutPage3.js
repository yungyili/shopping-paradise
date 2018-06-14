import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import StripeCheckout from 'react-stripe-checkout';
import {handlePayment} from '../../actions/orderActions';

const styles = {
  button: {
    marginRight: '1em'
  },
  navigation: {
    margin: '2em 0'
  },
  thanks: {
    textAlign: 'center',
    marginBottom: '2em'
  },
  divider: {
    margin: '2em 0'
  }
};

class CheckoutPage3 extends Component {
  constructor(props){
    super(props);
    this.onToken = this.onToken.bind(this);
  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  totalPrice(items){
    return items
            .map(item=>{ return item.isSelected? item.item.price*item.quantity: 0; })
            .reduce(function(acc, item) { return acc + item; });
  }

  onToken(token){
    console.log("stripe get token=", token);
    const {order} = this.props;

    this.props.handlePayment(order.content, token);
    this.props.history.push('/');
  }

  renderNavigationButtons(){
    const {classes} = this.props;

    return (
      <div className={classes.navigation}>
        <Button
          color="primary"
          variant="raised"
          className={classes.button}
          component={this.LinkWrapper}
          to="/"
        >
          OK
        </Button>
      </div>
    );
  }

  renderPayment = () => {
    const {order} = this.props;
    console.log("CheckoutPage3: renderPayment: order=", order);

    if (order.onging){
      return <div>...</div>;
    }

    return (
      <div>
        Total: ${this.totalPrice(order.content.items)}
        <div>
          <StripeCheckout
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
            token={this.onToken}
            amount={this.totalPrice(order.content.items)*100} // cents
            currency="USD"
          />
        </div>
      </div>
    );
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} >
        <h2 className={classes.thanks}>
          Thank You. Your Order Has Been Taken.
        </h2>
        {this.renderPayment()}
        <Divider className={classes.divider} />
        {this.renderNavigationButtons()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    order: state.order
  };
}

export default connect(mapStateToProps,{handlePayment})(
  withStyles(styles)(
    withRouter(CheckoutPage3)
));
