import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import red from '@material-ui/core/colors/red';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {fetchUserItems} from '../../actions/userActions';
import {removeFromShoppingCart, shoppingCartToOrder} from '../../actions/orderActions';
import {SHOPPING_CART} from '../../constants/orders';

const columnData = [
  { id: 'picture', numeric: false, disablePadding: false, label: 'picture' },
  { id: 'title', numeric: false, disablePadding: true, label: 'title' },
  { id: 'seller', numeric: false, disablePadding: false, label: 'seller' },
  { id: 'description', numeric: false, disablePadding: false, label: 'description' },
  { id: 'price', numeric: true, disablePadding: false, label: 'price (usd)' },
];

const LinkWrapper = ({ ...props }) => (
  <Link {...props} />
)

class BuyerShoppingCartHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

BuyerShoppingCartHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
    flex: '1 1 100%',
  },
  actions: {
    flex: '1 1 100%',
    color: theme.palette.text.secondary
  },
  action: {

  },
  title: {
    flex: '0 0 auto',
  },
});

let BuyerShoppingCartToolbar = props => {
  const { numSelected, selected, rowsPerPage, page, items, classes, handleDeleteItems, handleCheckout } = props;

 console.log("BuyerShoppingCartToolbar: selected=", selected);

  const getOnlySelectedItemId = () => {
    if (numSelected == 1) {
      const item = items.find(item => {return item._id === selected[0]; });
      return item._id;
    } else {
      return null;
    }
  };

  var editItemId = getOnlySelectedItemId();

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
            Shopping Cart
          </Typography>
        )}
      </div>

      <Grid container className={classes.actions}
          direction="row"
          justify="flex-end"
      >
        {numSelected > 0 && (
          <Grid item className={classes.action}>
            <Tooltip title="Checkout">
              <IconButton aria-label="Checkout" onClick={handleCheckout}>
                <MonetizationOnIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {numSelected > 0 && (
          <Grid item className={classes.action}>
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={handleDeleteItems}>
                <DeleteIcon style={{color:red[900]}}/>
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {numSelected == 0 && (
          <Grid item className={classes.action}>
            <Tooltip title="Add Item">
              <IconButton aria-label="add-item" component={LinkWrapper} to="/">
                <PlaylistAddIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Toolbar>
  );
};

BuyerShoppingCartToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

BuyerShoppingCartToolbar = withStyles(toolbarStyles)(BuyerShoppingCartToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  square: {
    marginLeft: "auto",
    marginRight: "auto",
    height: "50px",
    width: "50px",
    textAlign: "center",
    lineHeight: "50px",
    marginTop: '0.2em',
    marginBottom: '0.2em'
  },
  itemImage: {
    maxHeight: "50px",
    maxWidth: "50px",
    width: "100%",
    height: "100%",
    textAlign: "center",
  },
});

class BuyerShoppingCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'title',
      selected: [],
      items: this.getShoppingCartItems(),
      page: 0,
      rowsPerPage: 5,
      showErrorBar: false,
      errorMessage: null
    };
  }

  handleErrorBarOpen = () => {
    this.setState({ showErrorBar: true });
  }

  handleErrorBarClose = () => {
    this.setState({ showErrorBar: false });
  }

  getShoppingCartItems = () => {
    let items;
    try {
      items = JSON.parse(localStorage.getItem(SHOPPING_CART));
    } catch(err) {
      items = [];
    }
    console.log("BuyerShoppingCart: ctor: items=", items);

    return items && Array.isArray(items)? items: [];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({items: this.getShoppingCartItems()});
  }

  handleDeleteItems = () => {
    const {items, selected, page, rowsPerPage } = this.state;
    console.log("BuyerShoppingCart: handleDeleteItems, selected=", selected);
    this.props.removeFromShoppingCart(selected);

    this.setState({ selected: [] });
    this.props.history.push('/buy');
  }

  handleCheckout = () => {
    const {items, selected } = this.state;

    let errorMessage = null;

    if(items.length === 0 || selected.length === 0){
      return;
    }

    const sellerId = items.find(item => item._id === selected[0])._user;
    items.map(item => {
      if (selected.find(id => (item._id === id)) && item._user !== sellerId) {
        errorMessage = 'For checkout, selected items must belong to same seller';
      }
    });

    if (errorMessage){
      this.setState({errorMessage});
      this.handleErrorBarOpen();
    } else {
      this.props.shoppingCartToOrder(selected, this.props.location.pathname);
      this.setState({ selected: [] });
      this.props.history.push('/checkout');
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.items.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.items.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.items.map((n) => n._id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  renderErrorBar = () => {
    const { classes } = this.props;
    const message = `${this.state.errorMessage}`;

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}

          open={this.state.showErrorBar}
          autoHideDuration={6000}
          onClose={this.handleErrorBarClose}
        >
          <SnackbarContent
            className={classes.snackbar}
            aria-describedby="client-snackbar"
            message={message}
            action={
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleErrorBarClose}
              >
                <CloseIcon />
              </IconButton>
            }
          />
        </Snackbar>
      </div>
    );
  }

  render() {
    const { classes, user } = this.props;
    const { items, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

    return (
      <div>
        <LinearProgress color="secondary" style={{visibility: user.ongoing? 'visible':'hidden'}} />
        <Paper className={classes.root} style={{marginTop: '0'}}>
          <BuyerShoppingCartToolbar numSelected={selected.length} selected={selected}
            items={items} page={page} rowsPerPage={rowsPerPage}
            handleDeleteItems={this.handleDeleteItems}
            handleCheckout={this.handleCheckout}
          />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <BuyerShoppingCartHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={items.length}
              />
              <TableBody>
                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n, idx) => {
                  const isSelected = this.isSelected(n._id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n._id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={idx}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell>
                        <Paper className={classes.square}>
                          <img
                            src={n.pictureUrl}
                            alt="Item Image"
                            className={classes.itemImage}
                          />
                        </Paper>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.title}
                      </TableCell>
                      <TableCell>{n._user}</TableCell>
                      <TableCell>{n.description}</TableCell>
                      <TableCell numeric>{n.price}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        {this.renderErrorBar()}
      </div>
    );
  }
}

BuyerShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    user: state.user,
    order: state.order
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{fetchUserItems, removeFromShoppingCart, shoppingCartToOrder})(
    withRouter(BuyerShoppingCart)
  ));
