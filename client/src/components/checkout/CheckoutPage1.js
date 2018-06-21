import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {setCurrentOrder} from '../../actions/orderActions';
import {STRIPE} from '../../constants/orders';

const styles = {
  priceTag: { textAlign:'right'},
  padding: { margin: '1em 0'},
  button: {
    marginRight: '1em'
  },
  quantitySelect:{
    textAlign: 'right'
  }
};

class CheckoutPage1 extends Component {

  constructor(props){
    super(props);

    const {items, payment, receiverName, receiverAddress} = this.props.order.content;
    console.log("CheckoutPage1: ctor: order=", this.props.order);
    items.map(item=>{
      if(item.isSelected === undefined){
        item.isSelected = true;
      }
      return null;
    });

    this.state = {
      items: items,
      payment: payment? payment:STRIPE,
      receiverName: receiverName? receiverName: '',
      receiverAddress: receiverAddress? receiverAddress: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const {name, value} = event.target;
    console.log("handleInputChange:", name, value);

    this.setState({
      [name]: value
    });
  }

  totalPrice(items){
    return items
            .map(item=>{ return item.isSelected? item.item.price*item.quantity: 0; })
            .reduce(function(acc, item) { return acc + item; });
  }

  handleItemToggle = (index) => {
    var newItems = this.state.items;
    newItems[index].isSelected = !this.state.items[index].isSelected;
    this.setState({items: newItems});
  };

  handleQuantityChange = (index, quantity) => {
    var newItems = this.state.items;
    newItems[index].quantity = quantity;
    this.setState({items: newItems});
  }

  renderNumberOptions = (n) => {
    return _.range(1,n+1).map(i => {
      return (<option key={i} value={i}>{i}</option>);
    });
  }

  renderShoppingDetail() {
    const items = this.state.items;
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
            {items.map((item, index) => {
              const crossOutStyle=item.isSelected? {}:{textDecoration:'line-through'};

              console.log("CheckougPage1: item=", item);
              return (
                <TableRow key={item.item._id}>
                  <TableCell component="th" scope="row"
                    style={crossOutStyle}
                    onClick={()=>this.handleItemToggle(index)}
                  >
                    {item.item.title}
                  </TableCell>
                  <TableCell numeric style={crossOutStyle}>{item.item.price}</TableCell>
                  <TableCell className={classes.quantitySelect}>
                    <select
                      style={crossOutStyle}
                      name="quantity"
                      value={item.quantity}
                      onChange={(event)=>this.handleQuantityChange( index, event.target.value)}
                    >
                      {this.renderNumberOptions(item.item.storage)}
                    </select>
                  </TableCell>
                  <TableCell numeric style={crossOutStyle}>{item.item.price*item.quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  renderPayment(){
    const {classes} = this.props;

    return (
      <form>
        {[STRIPE/*other payment types*/].map(paymentType => {
          return (
            <div key={paymentType}>
              <div className="radio">
                <label>
                  <input type="radio" value={paymentType} name="payment"
                                checked={this.state.payment === paymentType}
                                onChange={this.handleInputChange} />
                  {paymentType}
                </label>
              </div>
              <div className={classes.padding} />
            </div>
          );
        })}
      </form>
    );
  }

  renderShipInformation(){
    const {classes} = this.props;
    return (
      <form>
        <div>
          <TextField
            label="Receiver Name"
            name="receiverName"
            className={classes.textField}
            value={this.state.receiverName}
            onChange={this.handleInputChange}
            margin="normal"
          />
          <div className={classes.padding} />
        </div>
        <div>
          <TextField
            label="Receiver Address"
            name="receiverAddress"
            className={classes.textField}
            value={this.state.receiverAddress}
            onChange={this.handleInputChange}
            margin="normal"
          />
          <div className={classes.padding} />
        </div>
      </form>
    );
  }

  onNextPage(){
    this.props.setCurrentOrder(this.state);
    this.props.onNextPage();
  }

  renderNavigationButtons(){
    const {classes, order} = this.props;

    return (
      <div>
        <Button
          color="secondary"
          variant="raised"
          className={classes.button}
          component={this.LinkWrapper}
          to={order.content.naviFrom? order.content.naviFrom:'/'}
        >
          Back
        </Button>
        <Button
          color="primary"
          variant="raised"
          className={classes.button}
          onClick={()=>{this.onNextPage()}}
        >
          Preview Order
        </Button>
      </div>
    );
  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  render() {
    console.log("CheckoutPage1: items=", this.state.items);
    const items = this.state.items;
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

export default withStyles(styles)(
  connect(mapStateToProps,{setCurrentOrder})(
    withRouter(CheckoutPage1)
  )
);
