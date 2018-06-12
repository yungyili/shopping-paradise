import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';

const styles = {
  button: {
    marginRight: '1em'
  }
};

class CheckoutPage3 extends Component {

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  renderNavigationButtons(){
    const {classes} = this.props;

    return (
      <div>
        <Button
          color="primary"
          variant="raised"
          className={classes.button}
          component={this.LinkWrapper}
          to="/"
        >
          OK
        </Button>
      </div>
    );
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root} >
        Page3
        {this.renderNavigationButtons()}
      </div>
    );
  }
}


export default withStyles(styles)(
  withRouter(CheckoutPage3)
);
