import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

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
  }
};

class CheckoutPage3 extends Component {

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  totalPrice(items){
    return items
            .map(item=>{ return item.isSelected? item.item.price*item.quantity: 0; })
            .reduce(function(acc, item) { return acc + item; });
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
    const {classes, order} = this.props;

    return (
      <div>
        Total: {this.totalPrice(order.items)}
        <div>
          Stripe button
        </div>
      </div>
    );
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} >
        <h2 className={classes.thanks}>
          Thank you. Your Order Has Been Taken.
        </h2>

        {this.renderPayment()}
        <Divider />

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

export default connect(mapStateToProps,null)(
  withStyles(styles)(
    withRouter(CheckoutPage3)
));
