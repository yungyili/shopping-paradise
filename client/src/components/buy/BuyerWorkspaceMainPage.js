import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Route, Switch} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import BuyerShoppingCart from './BuyerShoppingCart';
import BuyerOrderPage from './BuyerOrderPage';
import Header from '../Header';
import Footer from '../Footer';
import NotFound from '../NotFound';

const styles = theme => ({
  root: {
      flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuItem: {
  },
  primary: {},
});

class SellMainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: 'items'
    }
  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  renderMenu() {
    const { classes } = this.props;
    return (
      <Paper>
        <MenuList>
          <MenuItem component={this.LinkWrapper} to="/buy/shopping-cart" className={classes.menuItem}>
            Cart
          </MenuItem>
          <MenuItem component={this.LinkWrapper} to="/buy/order" className={classes.menuItem}>
            Orders
          </MenuItem>
        </MenuList>
      </Paper>
    );
  }

  renderWorkingArea(){
      const { classes } = this.props;

      return (
        <div>
          <Switch>
            <Route exact path="/buy" component={BuyerShoppingCart} />
            <Route exact path="/buy/shopping-cart" component={BuyerShoppingCart} />
            <Route exact path="/buy/order" component={BuyerOrderPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      );
  }

  render() {
      const { classes, auth } = this.props;

      return (
        <div className={classes.root}>
          <Header />
          <Grid container spacing={24}>
            <Grid item xs={12} sm={2}>
              {this.renderMenu()}
            </Grid>
            <Grid item xs={12} sm={10}>
              {this.renderWorkingArea()}
            </Grid>
          </Grid>
          <Footer />
        </div>
      );
  }
}

function mapStateToProps(state){
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps,null)(
  withStyles(styles)(withTheme()(SellMainPage)));
