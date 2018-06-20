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
import EditIcon from '@material-ui/icons/Edit';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import red from '@material-ui/core/colors/red';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {fetchUserItems} from '../../actions/userActions';
import {deleteItem} from '../../actions/userActions';

const columnData = [
  { id: 'title', numeric: false, disablePadding: true, label: 'title' },
  { id: 'description', numeric: false, disablePadding: false, label: 'description' },
  { id: 'price', numeric: true, disablePadding: false, label: 'price (usd)' },
  { id: 'storage', numeric: true, disablePadding: false, label: 'storage' },
  { id: 'category', numeric: false, disablePadding: false, label: 'category' },
  { id: 'isBuyable', numeric: false, disablePadding: false, label: 'is buyable?' },
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
  const { numSelected, selected, rowsPerPage, page, items, classes, handleDeleteItems } = props;

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
        {editItemId && (
          <Grid item className={classes.action}>
            <Tooltip title="Edit">
              <IconButton aria-label="Edit" component={LinkWrapper} to={`/sell/item/${editItemId}/edit`}>
                <EditIcon />
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
              <IconButton aria-label="add-item" component={LinkWrapper} to="/sell/item/add">
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
});

class BuyerShoppingCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      items: this.props.user.content.items,
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleDeleteItems = () => {
    const {items, selected, page, rowsPerPage } = this.state;
    console.log("BuyerShoppingCart: handleDeleteItems, selected=", selected);
    for (var i=0;i<selected.length; i++) {
      this.props.deleteItem(selected[i]);
    }
    this.setState({ selected: [] });
    this.props.history.push('/sell/item');
  }

  updateUserStateByProps = (nextProps) => {
    this.setState({items: nextProps.user.content.items.slice()});
  };

  componentWillReceiveProps(nextProps){
    if (this.props.user !== nextProps.user) {
      this.updateUserStateByProps(nextProps);
    }
  }

  componentDidMount() {
    this.props.fetchUserItems();
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
      this.setState({ selected: this.state.items.map((n, id) => id) });
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
                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
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
                        {n.title}
                      </TableCell>
                      <TableCell>{n.description}</TableCell>
                      <TableCell numeric>{n.price}</TableCell>
                      <TableCell numeric>{n.storage}</TableCell>
                      <TableCell>{n._category}</TableCell>
                      <TableCell>{n.isBuyable? "Yes":"No"}</TableCell>
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
      </div>
    );
  }
}

BuyerShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    user: state.user
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{fetchUserItems, deleteItem})(
    withRouter(BuyerShoppingCart)
  ));
