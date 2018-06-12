import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = {
  priceTag: { textAlign:'right'},
  padding: { margin: '1em 0'},
  button: {
    marginRight: '1em'
  },
  navigation: {
    margin: '2em 0'
  }
};
class CheckoutPage2 extends Component {

  totalPrice(items){
    return items
            .map(item=>{ return item.isSelected? item.item.price*item.quantity: 0; })
            .reduce(function(acc, item) { return acc + item; });
  }

  renderShoppingDetail() {
    const {items} = this.props.order;
    const {classes} = this.props;
    if(!items || items.length <=0 ){
      return <div>...</div>;
    }

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell numeric>Price</TableCell>
              <TableCell numeric>Quantity</TableCell>
              <TableCell numeric>Item Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.filter(item => item.isSelected).map((item, index) => {
              console.log("CheckougPage2: item=", item);
              return (
                <TableRow key={item.item._id}>
                  <TableCell component="th" scope="row">
                    {item.item.title}
                  </TableCell>
                  <TableCell numeric>{item.item.price}</TableCell>
                  <TableCell numeric>{item.quantity}</TableCell>
                  <TableCell numeric>{item.item.price*item.quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  renderPayment(){
    const {order} = this.props;
    
    return (
      <div>
        Pay by {order.payment}
      </div>
    );
  }

  renderShipInformation(){
    const {order} = this.props;

    return (
      <div>
        <div>
          <h4>Receiver Name</h4>
          <span>{order.receiverName}</span>
        </div>
        <div>
          <h4>Receiver Address</h4>
          <span>{order.receiverAddress}</span>
        </div>
      </div>
    );
  }

  onPreviousPage(){
    this.props.onPreviousPage();
  }

  onNextPage(){
    this.props.onNextPage();
  }

  renderNavigationButtons(){
    const {classes} = this.props;

    return (
      <div className={classes.navigation}>
        <Button
          color="secondary"
          variant="raised"
          className={classes.button}
          onClick={()=>{this.onPreviousPage()}}
        >
          Back
        </Button>
        <Button
          color="primary"
          variant="raised"
          className={classes.button}
          onClick={()=>{this.onNextPage()}}
        >
          Confirm
        </Button>
      </div>
    );
  }

  render() {
    const items = this.props.order.items;
    const {classes} = this.props;

    if(!items || items.length <=0 ){
      return <div>...</div>;
    }
    return (
      <div>
        <h3>Shopping Detail</h3>
          {this.renderShoppingDetail()}
          <div className={classes.priceTag}>
            <h3>Total:{this.totalPrice(items)}</h3>
          </div>
        <Divider />
        <h3>Payment</h3>
          {this.renderPayment()}
          <div className={classes.padding}></div>
        <Divider />
        <h3>Ship Information</h3>
          {this.renderShipInformation()}
        <div>
          {this.renderNavigationButtons()}
        </div>
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
    withRouter(CheckoutPage2)
));
