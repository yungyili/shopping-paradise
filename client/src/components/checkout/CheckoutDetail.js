import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  priceTag: { textAlign:'right'},
  padding: { margin: '1em 0'}
});



class CheckoutDetail extends Component {

  constructor(props){
    super(props);

    this.state = {
      items: this.props.location.state.buyItems,
      payment: "stripe"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  }

  totalPrice(items){
    return items.map(item=>item.item.price*item.quantity).reduce(function(acc, item) { return acc + item; });
  }

  renderShoppingDetail() {
    const items = this.props.location.state.buyItems;
    const {classes} = this.props;
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
            {items.map(item => {
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
    const {classes} = this.props;

    return (
      <form>
        {["stripe","VISA"].map(paymentType => {
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

  render() {
    console.log("CheckoutDetail: ", this.props.location);
    const {classes} = this.props;
    return (
      <div>
        <h3>Shopping Detail</h3>
          {this.renderShoppingDetail()}
          <div className={classes.priceTag}>
            <h3>Total:{this.totalPrice(this.state.items)}</h3>
          </div>
        <Divider />
        <h3>Payment</h3>
          {this.renderPayment()}
          <div className={classes.padding}></div>
        <Divider />
        <h3>Ship Information</h3>
      </div>
    );
  }
}

export default withStyles(styles)(CheckoutDetail);
