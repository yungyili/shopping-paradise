import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import BlockIcon from '@material-ui/icons/Block';
import VisibilityIcon from '@material-ui/icons/Visibility';
import red from '@material-ui/core/colors/red';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    margin: '1.5em 0',
  },
  actions: {
    flex: '1 1 100%',
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto',
  },
  square: {
    marginLeft: "auto",
    marginRight: "auto",
    height: "50px",
    width: "50px",
    textAlign: "center",
    lineHeight: "50px"
  },
  itemImage: {
    maxHeight: "50px",
    maxWidth: "50px",
    width: "100%",
    height: "100%",
    textAlign: "center"
  },
});

class SellOrderPageToolbar extends React.Component {

  state = {
    dialogOpen: false,
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  getOnlySelectedOrder = () => {
    const { numSelected, selected, orders } = this.props;
    if (numSelected == 1) {
      return orders.find(item => {return item._id === selected[0]; });
    } else {
      return null;
    }
  };

  renderItemsDetail = (order) => {
    const { classes } = this.props;
    const { items, quantities} = order;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Image</TableCell>
            <TableCell numeric>Qty</TableCell>
            <TableCell numeric>Price</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {item.title}
                </TableCell>
                <TableCell>
                  <Paper className={classes.square}>
                    <img
                      src={item.pictureUrl}
                      alt="Item Image"
                      className={classes.itemImage}
                    />
                  </Paper>
                </TableCell>
                <TableCell numeric>{quantities[idx]}</TableCell>
                <TableCell numeric>{item.price}</TableCell>
                <TableCell>{item._category}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  renderOrderDetail = () => {
    const { classes } = this.props;
    const order = this.getOnlySelectedOrder();

    return (
      <div>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="title" className={classes.title}>
              Buyer
            </Typography>
            <List>
                <ListItem>
                  <ListItemText
                    primary={`Name: ${order._buyer.name}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`E-Mail: ${order._buyer.email}`}
                  />
                </ListItem>
            </List>

            <Typography variant="title" className={classes.title}>
              Items
            </Typography>
            <div>
              {this.renderItemsDetail(order)}
            </div>
            <div className={classes.spacer} />

            <Typography variant="title" className={classes.title}>
              Total
            </Typography>
            <List>
                <ListItem>
                  <ListItemText
                    primary={`$${order.total} USD`}
                  />
                </ListItem>
            </List>

            <Typography variant="title" className={classes.title}>
              Has Customer Paid?
            </Typography>
            <List>
                <ListItem>
                  <ListItemText
                    primary={order.isPaid? "Yes":"No"}
                  />
                </ListItem>
            </List>

            <Typography variant="title" className={classes.title}>
              Has Item Been Shipped?
            </Typography>
            <List>
                <ListItem>
                  <ListItemText
                    primary={order.isShipped? "Yes":"No"}
                  />
                </ListItem>
            </List>

            <Typography variant="title" className={classes.title}>
              Has This Order Been Canceled?
            </Typography>
            <List>
                <ListItem>
                  <ListItemText
                    primary={order.isCanceled? "Yes":"No"}
                  />
                </ListItem>
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }

  render() {
    const { numSelected, selected, rowsPerPage, page, orders, classes, handleCancelOrder } = this.props;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography color="inherit" variant="subheading">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="title" id="tableTitle">
              Orders
            </Typography>
          )}
        </div>

        <Grid container className={classes.actions}
            direction="row"
            justify="flex-end"
        >
          {numSelected == 1 && (
            <Grid item className={classes.action}>
              <Tooltip title="View">
                <IconButton aria-label="View" onClick={this.handleDialogOpen}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleDialogClose}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
              >
                <DialogTitle id="form-dialog-title">Details of Order</DialogTitle>
                <DialogContent>
                  {this.renderOrderDetail()}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDialogClose} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          )}
          {numSelected > 0 && (
            <Grid item className={classes.action}>
              <Tooltip title="Cancel">
                <IconButton aria-label="Cancel" onClick={handleCancelOrder}>
                  <BlockIcon style={{color:red[900]}}/>
                </IconButton>
              </Tooltip>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    );
  }
};

SellOrderPageToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

export default withStyles(toolbarStyles)(SellOrderPageToolbar);
