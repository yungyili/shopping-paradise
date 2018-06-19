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
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import SellOrderPageToolbar from './SellOrderPageToolbar';
import {fetchUserSellOrders, sellerCancelOrder} from '../../actions/userActions';

const columnData = [
  { id: 'buyer', numeric: false, disablePadding: true, label: 'buyer' },
  { id: 'items', numeric: false, disablePadding: false, label: 'items' },
  { id: 'total', numeric: true, disablePadding: false, label: 'total (usd)' },
  { id: 'isPaid', numeric: true, disablePadding: false, label: 'isPaid' },
  { id: 'isShipped', numeric: false, disablePadding: false, label: 'isShipped' },
  { id: 'isCanceled', numeric: false, disablePadding: false, label: 'isCanceled' },
];

const LinkWrapper = ({ ...props }) => (
  <Link {...props} />
)

class SellOrderPageHead extends Component {
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

SellOrderPageHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
});

class SellOrderPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      orders: this.props.user.content.orders,
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleCancelOrder = () => {
    const {orders, selected, page, rowsPerPage } = this.state;
    console.log("SellOrderPage: handleCancelOrder, selected=", selected);
    for (var i=0;i<selected.length; i++) {
      this.props.sellerCancelOrder(selected[i]);
    }
    this.setState({ selected: [] });
    this.props.history.push('/sell/order');
  }

  updateUserStateByProps = (nextProps) => {
    this.setState({orders: nextProps.user.content.orders.slice()});
  };

  componentWillReceiveProps(nextProps){
    if (this.props.user !== nextProps.user) {
      this.updateUserStateByProps(nextProps);
    }
  }

  componentDidMount() {
    this.props.fetchUserSellOrders();
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.orders.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.orders.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.orders.map((n, id) => id) });
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

  itemsToDescriptions = (items, quantities) => {
    var ret=[];
    for(var i=0;i<items.length;i++){
      ret.push(`${items[i].title}(${quantities[i]}pcs)`);
    }
    return ret;
  }

  render() {
    const { classes, user } = this.props;
    const { orders, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

    return (
      <div>
        <LinearProgress color="secondary" style={{visibility: user.ongoing? 'visible':'hidden'}} />
        <Paper className={classes.root} style={{marginTop: '0'}}>
          <SellOrderPageToolbar numSelected={selected.length} selected={selected}
            orders={orders} page={page} rowsPerPage={rowsPerPage}
            handleCancelOrder={this.handleCancelOrder}
          />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <SellOrderPageHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={orders.length}
              />
              <TableBody>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                  const isSelected = this.isSelected(n._id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n._id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n._id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n._buyer.name}
                      </TableCell>
                      <TableCell>{this.itemsToDescriptions(n.items, n.quantities)}</TableCell>
                      <TableCell numeric>{n.total}</TableCell>
                      <TableCell numeric>{n.isPaid?"Yes":"No"}</TableCell>
                      <TableCell>{n.isShipped?"Yes":"No"}</TableCell>
                      <TableCell>{n.isCanceled?"Yes":"No"}</TableCell>
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
            count={orders.length}
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
      </div>
    );
  }
}

SellOrderPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    user: state.user
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{fetchUserSellOrders, sellerCancelOrder})(
    withRouter(SellOrderPage)
  ));
