import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {fetchItem} from '../actions/itemActions';
import {setCurrentOrder, setLeaveForLogin, addToShoppingCart} from '../actions/orderActions';
import BreadCumb from './BreadCumb';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  imageContainer: {
    width: '100%'
  },
  image: {
    width: 'auto',
    maxHeight: '300px',
  },
  divider: {
    marginTop: '1%',
    marginBottom: '1%'
  },
  button: {
    marginRight: '0.5em'
  }
});

class Item extends Component {
  constructor(props){
    super(props);

    this.state = {
      quantity: 0
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    console.log("Item:componentDidMount: ", this.props.match.params);
    this.props.fetchItem(this.props.match.params.id);
  }

  handleInputChange(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  }

  renderBuyButton(){
    const { classes, auth } = this.props;
    const disabled = auth.ongoing;

    return (
      <Button type="submit" variant="raised"
        color="primary" className={classes.button}
        disabled={disabled}
      >
        Buy Now
      </Button>
    );
  }

  handleAddShoopingCart = () => {
    const {item} = this.props;
    if(!item || !item.content || !item.content[0]) {
      return;
    }

    this.props.addToShoppingCart(item.content[0]);
  }

  handleSubmit(event) {
    console.log('Item: buy: ' + this.state.quantity);
    const { auth } = this.props;

    event.preventDefault();
    if (this.state.quantity < 1){
      return;
    }

    const item = this.props.item.content[0];
    if (!item){
      return;
    }

    this.props.setCurrentOrder({
      items: [{
        item: item,
        quantity: this.state.quantity,
      }],
      naviFrom: this.props.location.pathname
    });

    if (!auth.content){
      this.props.setLeaveForLogin(this.props.location.pathname);
      this.props.history.push('/login');
    } else {
      this.props.history.push('/checkout');
    }
  }

  renderNumberOptions(n){
    return _.range(1,n+1).map(i => {
      return (<option key={i} value={i}>{i}</option>);
    });
  }

  renderItem(){
    const { classes } = this.props;

    if (this.props.item.ongoing || !this.props.item.content[0]) {
      return (<div>...</div>);
    } else {
      const item = this.props.item.content[0];
      console.log("renderItem: item=", item);
      return (
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={24} justify="center">
                <Grid item>
                  <img src={item.pictureUrl} alt={item.title} className={classes.image}></img>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={24}>

                <Grid item xs={12}>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <h1>$ {item.price}</h1>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="raised" color="secondary" className={classes.button}
                    onClick={this.handleAddShoopingCart}
                  >
                    <AddShoppingCartIcon />
                  </Button>
                  <form onSubmit={this.handleSubmit}>
                    {this.renderBuyButton()}
                    <select name="quantity" value={this.state.quantity} onChange={this.handleInputChange}>
                      <option key={0} value={0} disabled>...</option>
                      {this.renderNumberOptions(item.storage)}
                    </select>
                  </form>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </div>
      );
    }
  }

  renderBreadCumb(){
    if (this.props.item.ongoing || !this.props.item.content[0]) {
      return (<div>...</div>);
    } else {
      return (<BreadCumb path={this.props.item.content[0].path} tailLink={true} />);
    }
  }

  render(){
    const { classes, item, auth } = this.props;
    console.log("Item: render(): item=", item);

    if (auth.ongoing || item.ongoing){
      return (<LinearProgress color="secondary" />)
    }

    return (
      <div className={classes.root}>
        <div>
          {this.renderBreadCumb()}
        </div>
        <Divider className={classes.divider} />
        <div>
          {this.renderItem()}
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
    item: state.item,
    auth: state.auth
  };
}

export default
  connect(mapStateToProps,{fetchItem, setCurrentOrder, setLeaveForLogin, addToShoppingCart})(
    withStyles(styles)(
      withRouter(Item)
    )
  );
