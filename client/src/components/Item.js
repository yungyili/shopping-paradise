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
import Button from '@material-ui/core/Button';
import {fetchItem} from '../actions/itemActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import BreadCumb from './BreadCumb';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    maxWidth: '300px',
    height: 'auto'
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

  }

  componentDidMount(){
    console.log("Item:componentDidMount: ", this.props.match.params);
    this.props.fetchItem(this.props.match.params.id);
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
            <Grid item xs={6}>
              <img src={item.pictureUrl} className={classes.image}></img>
            </Grid>
            <Grid item xs={6}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <h1>$ {item.price}</h1>
              <Button variant="raised" color="secondary" className={classes.button}>
                Add to wishlist
              </Button>
              <Button variant="raised" color="primary" className={classes.button}>
                Buy
              </Button>
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
