import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';

const styles = {
  button: {
    marginRight: '1em'
  }
};

class CheckoutPage_2 extends Component {

  onPreviousPage(){
    this.props.onPreviousPage();
  }

  onNextPage(){
    this.props.onNextPage();
  }

  renderNavigationButtons(){
    const {classes} = this.props;

    return (
      <div>
        <Button
          color="secondary"
          variant="raised"
          className={classes.button}
          onClick={()=>{this.onPreviousPage()}}
        >
          Back
        </Button>
        <Button
          color="primary"
          variant="raised"
          className={classes.button}
          onClick={()=>{this.onNextPage()}}
        >
          Next
        </Button>
      </div>
    );
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} >
        Page2
        {this.renderNavigationButtons()}
      </div>
    );
  }
}


export default withStyles(styles)(
  withRouter(CheckoutPage_2)
);
