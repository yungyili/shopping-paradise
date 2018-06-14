import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import {fetchItem} from '../../actions/itemActions';

const styles = theme => ({
  root: {

  }
});

class SellItemEditForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      pictureUrl: null,
      price: 0,
      storage: 0,
      _category: null,
      isBuyable: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    const itemId = this.props.match.params.id;
    if (itemId){
      this.props.fetchItem(itemId);
    }
  }

  handleSubmit(event) {

  }

  handleInputChange(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { classes } = this.props;
    const itemId = this.props.match.params.id;

    return (
      <div className={classes.root}>
      </div>
    );
  }
}

SellItemEditForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    item: state.item
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{fetchItem})(
    withRouter(SellItemEditForm)
  )
);
