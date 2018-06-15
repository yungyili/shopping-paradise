import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import SellItemTable from './SellItemTable';
import SellItemEditForm from './SellItemEditForm';
import SellOrderPage from './SellOrderPage';
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
          <MenuItem component={this.LinkWrapper} to="/sell/item" className={classes.menuItem}>
            Items
          </MenuItem>
          <MenuItem component={this.LinkWrapper} to="/sell/order" className={classes.menuItem}>
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
            <Route exact path="/sell" component={SellItemTable} />
            <Route exact path="/sell/item" component={SellItemTable} />
            <Route exact path="/sell/item/:id(\w+)/edit" component={SellItemEditForm} />
            <Route exact path="/sell/item/add" component={SellItemEditForm} />
            <Route exact path="/sell/order" component={SellOrderPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      );
  }

  render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={2}>
              {this.renderMenu()}
            </Grid>
            <Grid item xs={12} sm={10}>
              {this.renderWorkingArea()}
            </Grid>
          </Grid>
        </div>
      );
  }
}

export default withStyles(styles)(withTheme()(SellMainPage));
