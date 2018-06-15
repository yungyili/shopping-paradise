import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
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
  }
});

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

  handleSubmit(event) {}

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

    return (
      <div>
        <TextField
          label="title"
          name="title"
          className={classes.textField}
          value={this.state.item.title}
          onChange={this.handleInputChange}
          margin="normal"
        />
      </div>
    );
  };

  renderCategorySelector = () => {
    return <div>Category Selector</div>;
  };

  renderNavigationButton = () => {
    return (
      <div>
        <Button color="secondary">Cancel</Button>
        <Button color="primary">OK</Button>
      </div>
    );
  };

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
                description
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
