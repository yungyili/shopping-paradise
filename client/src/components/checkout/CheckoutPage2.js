import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';

const styles = {
};

class CheckoutPage_2 extends Component {

  constructor(props) {
    super(props)
  }

  renderNaviationButton(){
    
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} >
        Page2
        {this.renderNaviationButton()}
      </div>
    );
  }
}


export default withStyles(styles)(
  withRouter(CheckoutPage_2)
);
