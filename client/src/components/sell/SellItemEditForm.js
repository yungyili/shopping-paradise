import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { fetchItem } from "../../actions/itemActions";

const styles = theme => ({
  root: {},
  button: {},
  input: {},
  icon: {},
  textField: {
    marginRight: "1em"
  },
  editForm: {
    padding: "1em"
  },
  square: {
    marginLeft: "auto",
    marginRight: "auto",
    height: "150px",
    width: "150px",
    textAlign: "center",
    lineHeight: "150px"
  },
  dialog: {
    width: "150px",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto"
  },
  itemImage: {
    maxHeight: "150px",
    maxWidth: "150px",
    width: "100%",
    height: "100%",
    textAlign: "center"
  },
  dialogButton: {
    width: "100%"
  },
  textField: {
    width: '100%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  }
});

const LinkWrapper = ({ ...props }) => (
  <Link {...props} />
)

class SellItemEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {
        title: '',
        description: '',
        pictureUrl: '',
        price: 0,
        storage: 0,
        _category: '',
        isBuyable: false
      },
      error: {
        title: null,
        description: null,
        pictureUrl: null,
        price: null,
        storage: null,
        _category: null,
        isBuyable: null,
      },
      picDialogOpen: false,
      picDialogValue: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateItemStateByProps = nextProps => {
    const newItem = { ...nextProps.item.content[0] };
    this.setState({ item: newItem });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.content.length > 0) {
      this.updateItemStateByProps(nextProps);
    }
  }

  componentDidMount() {
    const itemId = this.props.match.params.id;
    if (itemId) {
      this.props.fetchItem(itemId);
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("SellItemEditForm: handleSubmit");

    const newState = {...this.state};

    const requiredFields = ['title', 'pictureUrl', 'price', 'storage', '_category', 'isBuyable'];

    requiredFields.map(field => {
      newState.error[field] = '';
      if (!this.state.item[field]) {
        newState.error[field] = 'Required Field';
      }
    });

    this.setState(newState);
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    const newState = {...this.state};
    newState.item[name] = value;
    this.setState(newState);
  }

  handlePicUrlChange = event => {
    console.log(
      "SellItemEditForm: handlePicUrlChange: event.traget=",
      event.target
    );
    event.preventDefault();

    const newState = { ...this.state };
    newState.picDialogValue = event.target.value;
    this.setState(newState);
  };

  handlePicDialogOpen = () => {
    const newState = { ...this.state };
    newState.picDialogOpen = true;
    newState.picDialogValue = newState.item.pictureUrl;
    this.setState(newState);
  };

  handlePicDialogOK = () => {
    const newState = { ...this.state };
    newState.item.pictureUrl = this.state.picDialogValue;
    this.setState(newState);
    this.handlePicDialogClose();
  };

  handlePicDialogClose = () => {
    const newState = { ...this.state };
    newState.picDialogOpen = false;
    this.setState(newState);
  };

  renderPictureHolder = () => {
    const { classes } = this.props;
    const { pictureUrl } = this.state.item;

    return (
      <div>
        <Paper className={classes.square}>
          <img
            src={pictureUrl}
            alt="Item Image"
            className={classes.itemImage}
          />
        </Paper>
        {this.renderPicDialog()}
      </div>
    );
  };

  renderPicDialog = () => {
    const { classes } = this.props;

    return (
      <div className={classes.dialog}>
        <Button
          onClick={this.handlePicDialogOpen}
          className={classes.dialogButton}
        >
          Change Image
        </Button>
        <Dialog
          open={this.state.picDialogOpen}
          onClose={this.handlePicDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText />
            <TextField
              autoFocus
              margin="dense"
              id="picUrl"
              label="Item Picture URL"
              type="text"
              value={this.state.picDialogValue ? this.state.picDialogValue : ""}
              onChange={this.handlePicUrlChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handlePicDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handlePicDialogOK} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  renderFields = () => {
    const { classes } = this.props;
    const {error, item} = this.state;

    return (
      <div>
        <Grid item xs={12} sm={12}>
          <TextField
            label="title"
            name="title"
            error={error.title? true: false}
            helperText={ error.title? error.title: ''}
            className={classes.textField}
            value={item.title}
            onChange={this.handleInputChange}
            margin="normal"
          />
        </Grid>
        <Grid container direction="row">
          <Grid item xs={12} sm={6}>
            <TextField
              style={{paddingRight:'0.5em'}}
              label="price (USD)"
              name="price"
              type="number"
              error={error.price? true: false}
              helperText={ error.price? error.price: ''}
              className={classes.textField}
              value={item.price}
              onChange={this.handleInputChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              style={{paddingLeft:'0.5em'}}
              label="storage"
              name="storage"
              type="number"
              error={error.storage? true: false}
              helperText={ error.storage? error.storage: ''}
              className={classes.textField}
              value={item.storage}
              onChange={this.handleInputChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  renderCategorySelector = () => {
    return <div>Category Selector</div>;
  };

  renderNavigationButton = () => {
    return (
      <Grid container direction="row" justify="flex-end" >
        <Button color="secondary" component={LinkWrapper} to={"/sell"}>Cancel</Button>
        <Button type="submit" color="primary">OK</Button>
      </Grid>
    );
  };

  renderDescriptionField = () => {
    const { classes } = this.props;
    const error = this.state.error.description;

    return (
      <div>
        <TextField
          label="description"
          name="description"
          error={error? true: false}
          helperText={ error? error: ''}
          className={classes.textField}
          value={this.state.item.description}
          onChange={this.handleInputChange}
          margin="normal"
          multiline={true}
          rows={4}
          rowsMax={4}
        />
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const fetchedItem = this.props.item;
    const { item } = this.state;

    console.log("SellItemEditForm: render: state.item=", item);

    if (fetchedItem.ongoing) {
      return <LinearProgress color="secondary" />;
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.editForm}>
          <form onSubmit={this.handleSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={12} sm={6}>
                {this.renderPictureHolder()}
              </Grid>
              <Grid item xs={12} sm={6}>
                {this.renderFields()}
                {this.renderCategorySelector()}
              </Grid>
              <Grid item xs={12}>
                {this.renderDescriptionField()}
              </Grid>
            </Grid>

            {this.renderNavigationButton()}
          </form>
        </Paper>
      </div>
    );
  }
}

SellItemEditForm.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    item: state.item
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, { fetchItem })(withRouter(SellItemEditForm))
);