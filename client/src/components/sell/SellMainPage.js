import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

const styles = theme => ({
});

class Footer extends Component {
  render() {
      const { classes } = this.props;
      return (
        <div>
          Sell Main Page
        </div>
      );
  }
}

export default withStyles(styles)(withTheme()(Footer));
