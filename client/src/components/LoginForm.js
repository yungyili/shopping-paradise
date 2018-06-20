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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {jwtLogin} from '../actions/authActions';

const styles = theme => ({
  loginForm: {
    margin: '0 30%',
    minWidth: '300px'
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

const signUpFields = [
  {
    name: 'userName',
    label: 'User Name',
    type: 'text'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email'
  }
];


class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      signUpDialog: false,
      signUp: {
        userName: {
          value: '',
          error: null
        },
        email: {
          value: '',
          error: null
        },
        password: {
          value: '',
          error: null
        },
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const {email, password} = this.state;
    console.log('LoginForm submit: ', email, password);
    event.preventDefault();
    if (this.props.handleLeaveForLogin){
      this.props.handleLeaveForLogin();
    }
    this.props.jwtLogin({email, password}, this.props.history);
  }

  onGoogleLogin = () => {
    if (this.props.handleLeaveForLogin){
      this.props.handleLeaveForLogin();
    }
  }

  handleSignUpInputChange = (event) => {
    const {name, value} = event.target;

    const newState = this.state.signUp;
    newState[name].value = value;

    this.setState({
      signUp:{
        ...newState
      }
    });
  }

  handleInputChange = (event) => {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });
  }

  handleSignUpOpen = () => {
    this.resetSignUpInput();
    this.setState({ signUpDialog: true });
  }

  handleSignUpClose = () => {
    this.setState({ signUpDialog: false });
  }

  handleSignUpOK = () => {
    const { signUp } = this.state;
    const newState = {...this.state};

    signUpFields.map(field => {
        newState.signUp[field.name].error = null;
        return null;
    });

    var validateOK = true;
    signUpFields.map(field => {
      if(!signUp[field.name].value) {
        newState.signUp[field.name].error =  'Required field';
        validateOK = false;
      }
      return null;
    });

    this.setState(newState);

    if (validateOK) {
      this.handleSignUpClose();
    }
  }

  resetSignUpInput = () => {
    const newState = {...this.state};
    signUpFields.map(field => {
        newState.signUp[field.name].error = null;
        newState.signUp[field.name].value = '';
        return null;
    });
    this.setState(newState);
  }

  renderSignUpForm = () => {
    const { classes } = this.props;
    const { signUp } = this.state;
    console.log("LoginForm: renderSignUpForm: this.state=", this.state);

    return (
      <div>
        <Button variant="raised"
          color="secondary" className={classes.button}
          onClick={this.handleSignUpOpen}
        >
          Sign Up
        </Button>
        <form>
          <Dialog
            open={this.state.signUpDialog}
            onClose={this.handleSignUpClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your user name, email address and password here.
              </DialogContentText>
              {signUpFields.map((field, idx) => {
                return (
                  <TextField
                    {...idx===0?{autoFocus:true}:{}} margin="dense"
                    name={field.name} label={field.label} type={field.type}
                    fullWidth
                    onChange={this.handleSignUpInputChange}
                    value={signUp[field.name].value}
                    error={signUp[field.name].error? true: false}
                    key={field.name}
                  />
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSignUpClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={this.handleSignUpOK} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.loginForm}>
        {this.renderSignUpForm()}
        <Divider />
        <Button variant="raised" href="/api/auth/google" onClick={this.onGoogleLogin} color="secondary" className={classes.button}>
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
