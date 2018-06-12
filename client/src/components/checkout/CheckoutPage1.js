import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
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

const styles = {
  priceTag: { textAlign:'right'},
  padding: { margin: '1em 0'},
  button: {
    marginRight: '1em'
  }
};

class CheckoutPage1 extends Component {

  constructor(props){
    super(props);

    const {items} = this.props.order;
    items.map(item=>{item.isSelected=true;});

    this.state = {
      items: items,
      payment: "Stripe",
      receiverName: '',
      receiverAddress: ''
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

              return (
                <TableRow key={item.item._id}>
                  <TableCell component="th" scope="row"
                    style={crossOutStyle}
                    onClick={()=>this.handleItemToggle(index)}
                  >
                    {item.item.title}
                  </TableCell>
                  <TableCell numeric style={crossOutStyle}>{item.item.price}</TableCell>
                  <TableCell numeric style={crossOutStyle}>{item.quantity}</TableCell>
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
        {["Stripe","VISA"].map(paymentType => {
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

  rederNavigationButtons(){
    const {classes} = this.props;

    return (
      <div>
        <Button
          color="secondary"
          variant="raised"
          className={classes.button}
          to={"/checkout/payment"} component={this.LinkWrapper}
        >
          Back
        </Button>
        <Button
          color="primary"
          variant="raised"
          className={classes.button}
          to={"/checkout/payment"} component={this.LinkWrapper}
        >
          Next
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
          {this.rederNavigationButtons()}
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
  connect(mapStateToProps,null)(CheckoutPage1)
);
