import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  header: {
  },
  link : {
    textDecoration: 'none'
  }
};

class CheckoutHeader extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Link to="/" className={classes.link} >
          <Typography variant="display3" align="center">
            Shopping Paradise
          </Typography>
        </Link>
      </div>
    );
  }
}


export default withStyles(styles)(CheckoutHeader);
