import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  footer: {
    marginTop: '4em',
    height: '100px',
    textAlign: 'center'
  },
  link : {
    textDecoration: 'none'
  }
};

class CheckoutFooter extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.footer}>
        &copy;2018 Shopping Paradise
      </div>
    );
  }
}


export default withStyles(styles)(CheckoutFooter);
