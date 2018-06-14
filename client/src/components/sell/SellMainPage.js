import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import SellItemTable from './SellItemTable';

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

  onMenuClick = (name) => {
    this.setState({menu: name});
  }

  renderMenu() {
    const { classes } = this.props;
    return (
      <Paper>
        <MenuList>
          <MenuItem onClick={()=>this.onMenuClick('items')} name="items-menu" className={classes.menuItem}>
            Items
          </MenuItem>
          <MenuItem onClick={()=>this.onMenuClick('orders')} name="orders-menu" className={classes.menuItem}>
            Orders
          </MenuItem>
        </MenuList>
      </Paper>
    );
  }

  renderWorkingArea(){
      const { classes } = this.props;

      if (this.state.menu === 'orders'){
        return (<div> Orders Working Area</div>);
      } else {
        return (<SellItemTable />);
      }
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
