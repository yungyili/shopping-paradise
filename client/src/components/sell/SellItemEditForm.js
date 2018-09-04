import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {Link} from 'react-router-dom';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchItem } from "../../actions/itemActions";
import {fetchCategory} from '../../actions/categoryActions';

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
    const newState = this.state;
    newState.item = { ...nextProps.item.content[0] };

    const categories = nextProps.category.content;
    if (categories.length > 0) {
      const root = categories.find(c => c.parentId === undefined);
      newState.item._category = root._id;
    }
    this.setState(newState);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.content.length > 0 || nextProps.category.content.length > 0) {
      this.updateItemStateByProps(nextProps);
    }
  }

  componentDidMount() {
    const itemId = this.props.match.params.id;
    if (itemId) {
      this.props.fetchItem(itemId);
    }
    this.props.fetchCategory();
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

  getCategoryPath = (id, categories) => {
    const index = categories.findIndex(category => {return category._id === id;});
    const category = categories.find(category => {return category._id === id;});
    if (index === -1) {
      return null;
    }

    const temp = categories.slice(0, index+1);
    const path = temp.filter(
      c => { return c.lft < category.lft && category.rgt < c.rgt; });

    return path;
  }

  getCategorySiblings = (id, categories )=> {
    const parent = this.getCateogryParent(id, categories);
    if (!parent) {
      return [categories.find(c => {return c._id === id;})];
    }
    console.log("SellItemEditForm: getCategorySiblings: parent=", parent);

    const sibling = this.getCategoryChilds(parent._id, categories);
    return sibling;
  }

  getCateogryParent = (id, categories) => {
    const category = categories.find(c => {return c._id === id;});
    return categories.find(c => {return c._id === category.parentId;});
  }

  getCategoryChilds = (id, categories) => {
    const index = categories.findIndex(category => {return category._id === id;});
    const category = categories.find(category => {return category._id === id;});
    if (index === -1) {
      return null;
    }

    var targetLft = category.lft + 1;
    var ret = [];
    while(true) {
      const child = categories.find(c => {return c.lft === targetLft;});
      if (!child){
        break;
      }
      ret.push(child);
      targetLft = child.rgt+1;
    }

    return ret;
  }

  rendCategoryMenu = (id, categories) => {
    const siblings = this.getCategorySiblings(id, categories);
    console.log("SellItemEditForm: rendCategoryMenu: siblings=", siblings);

    return (
      <FormControl>
        <Select
          value={this.state.item._category}
          onChange={this.handleInputChange}
          name="_category"
        >
           {siblings.map((c, idx) => {return (
            <MenuItem
              key={idx}
              value={c._id}
              selected={c._id===id?"selected":""}
            >
              {c.title}
            </MenuItem>);})}
        </Select>
      </FormControl>
    );
  }

  onNextCategoryLevel = () => {
    const { classes } = this.props;
    const categories = this.props.category.content.category;
    const selectedCategoryId = this.state.item._category;

    const childs = this.getCategoryChilds(selectedCategoryId, categories);
    if(!childs){
      return;
    }

    const newState = {...this.state};
    newState.item._category = childs[0]._id;
    this.setState(newState);
  }

  onPreviousCategoryLevel = () => {
    const { classes } = this.props;
    const categories = this.props.category.content.category;
    const selectedCategoryId = this.state.item._category;

    const parent = this.getCateogryParent(selectedCategoryId, categories);
    if (!parent) {
      return;
    }

    const newState = {...this.state};
    newState.item._category = parent._id;
    this.setState(newState);
  }

  renderPreviousLevelCategoryButton = (id, categories) => {
    const parent = this.getCateogryParent(id, categories);

    if (!parent) {
      return null;
    }

    return (
        <IconButton onClick={this.onPreviousCategoryLevel}>
          <ChevronLeftIcon />
        </IconButton >)
  }

  renderNextLevelCategoryButton = (id, categories) => {
    const childs = this.getCategoryChilds(id, categories);

    if (childs.length === 0) {
      return null;
    }

    return (
        <IconButton onClick={this.onNextCategoryLevel}>
          <ChevronRightIcon />
        </IconButton >)
  }

  renderCategoryBreadCrumbs = (path) => {
    return (
      <div>
        {path.map((c, idx) => {
          if (idx == 0){
            return <span key={idx}>{c.title}</span>;
          } else {
            return <span key={idx}> >> {c.title}</span>;
          }
        })}
      </div>)

  }

  renderCategorySelector = () => {
    const { classes } = this.props;
    const categories = this.props.category.content.category;
    const selectedCategoryId = this.state.item._category;

    if (!categories || !selectedCategoryId) {
      return <div>...</div>;
    }

    console.log("SellItemEditForm: renderCategorySelector: selectedCategoryId=",
      selectedCategoryId,
      "categories=",
      categories );

    categories.sort((a,b)=>{
      return a.lft - b.lft;
    });

    const root = categories.find(category => {return category.parentId === undefined});
    if (!root) {
      this.props.fetchCategory();
      return (<div>...</div>);
    }
    console.log("SellItemEditForm: renderCategorySelector: child of root=", this.getCategoryChilds(root._id, categories));

    const path = this.getCategoryPath(selectedCategoryId, categories);
    if(!path){
      return (<div>...</div>);
    }
    console.log("SellItemEditForm: renderCategorySelector: path=", path);

    return (
      <div>
        {this.renderCategoryBreadCrumbs(path)}
        <div>
          {this.renderPreviousLevelCategoryButton(selectedCategoryId, categories)}
          {this.rendCategoryMenu(selectedCategoryId, categories)}
          {this.renderNextLevelCategoryButton(selectedCategoryId, categories)}
        </div>
      </div>
    );
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
    const { classes, category } = this.props;
    const fetchedItem = this.props.item;
    const { item } = this.state;

    console.log("SellItemEditForm: render: state.item=", item);

    if (fetchedItem.ongoing || category.ongoing) {
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
    item: state.item,
    category: state.category
  };
}

export default withStyles(styles)(
  connect(mapStateToProps, { fetchItem, fetchCategory })(withRouter(SellItemEditForm))
);
