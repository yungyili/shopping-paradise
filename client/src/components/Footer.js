import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTheme } from '@material-ui/core/styles';

const styles = theme => ({
  footer: {
    marginTop: '4em',
    height: '100px',
    lineHeight: '100px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: 'grey',
    width: '100%',
  },
  link : {
    textDecoration: 'none'
  }
});

class Footer extends Component {
  render() {
    const { classes } = this.props;
    const { theme } = this.props;
    const primaryColor = theme.palette.primary.main;
    console.log("Footer: this.props", this.props);

    return (
        <Typography
          variant="body1"
          color="inherit"
          style={{backgroundColor: primaryColor}}
          className={classes.footer}
        >
          &copy;2018 Shopping Paradise
        </Typography>
    );
  }
}

export default withStyles(styles)(withTheme()(Footer));
