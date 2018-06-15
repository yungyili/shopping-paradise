import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const styles = theme => ({
  root: {
  },
});

class SellOrderPage extends Component {
  constructor(props) {
    super(props);
  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  )

  render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          Order Page
        </div>
      );
  }
}

export default withStyles(styles)(withTheme()(SellOrderPage));
