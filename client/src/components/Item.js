import _ from 'lodash';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {fetchItem} from '../actions/itemActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import BreadCumb from './BreadCumb';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  image: {
    padding: theme.spacing.unit,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  divider: {
    marginTop: '1%',
    marginBottom: '1%'
  },
  items: {
    marginTop: '3%'
  },
  pagination: {
    direction: 'row',
    justify: 'center'
  }
});

class Item extends Component {
  constructor(props){
    super(props);

  }

  componentDidMount(){
    console.log("Item:componentDidMount: ", this.props.match.params);
    this.props.fetchItem(this.props.match.params.id);
  }

  renderItem(){
    if (this.props.item.ongoing || !this.props.item.content[0]) {
      return (<div>...</div>);
    } else {
      return <div>Item information</div>;
    }
  }

  renderBreadCumb(){
    if (this.props.item.ongoing || !this.props.item.content[0]) {
      return (<div>...</div>);
    } else {
      return (<BreadCumb path={this.props.item.content[0].path}/>);
    }
  }

  render(){
    const { classes, item } = this.props;
    console.log("Item: render(): item=", item);
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
  return {item: state.item};
}

export default connect(mapStateToProps,{fetchItem})(
  withStyles(styles)(Item)
);
