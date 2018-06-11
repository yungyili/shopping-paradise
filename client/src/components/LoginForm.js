import React, {Component} from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import GoogleIcon from 'material-ui-next-community-icons/icons/google';
import FacebookIcon from 'material-ui-next-community-icons/icons/facebook-box';
import {jwtLogin} from '../actions/authActions';

const styles = theme => ({
  loginForm: {
    margin: '0 30%'
  },
  button: {
    width: '100%',
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  icon: {
    marginLeft: '0.5em'
  },
  textField: {
    width: '90%',
    margin: '0 5%'
  },
});

class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const {email, password} = this.state;
    console.log('LoginForm submit: ', email, password);
    event.preventDefault();
    this.props.jwtLogin({email, password}, this.props.history);
  }

  handleInputChange(event) {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.loginForm}>
        <Button variant="raised" href="/signup" color="secondary" className={classes.button}>
          Sing Up
        </Button>
        <Divider />
        <Button variant="raised" href="/api/auth/google" color="secondary" className={classes.button}>
          Login with Google <GoogleIcon className={classes.icon}/>
        </Button>
        <Button variant="raised" href="/api/auth/google" color="secondary" className={classes.button}>
          Login with Facebook <FacebookIcon className={classes.icon}/>
        </Button>
        <Divider />
        <form onSubmit={this.handleSubmit}>
          <TextField
            label="e-mail"
            name="email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleInputChange}
            margin="normal"
          />
          <TextField
            label="password"
            name="password"
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleInputChange}
            margin="normal"
            type="password"
          />
          <Button variant="raised" type="submit" color="secondary" className={classes.button}>
            Login
          </Button>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {
    auth: state.auth
  };
}

export default withStyles(styles)(
  connect(mapStateToProps,{jwtLogin})(
    withRouter(LoginForm)
  )
);
