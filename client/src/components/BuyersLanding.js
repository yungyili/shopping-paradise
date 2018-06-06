import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import indigo from '@material-ui/core/colors/indigo';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {fetchCategory} from '../actions/categoryActions';
import {fetchItem, fetchItemCount} from '../actions/itemActions';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  image: {
    padding: theme.spacing.unit,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  divider: {
    marginTop: '1%',
    marginBottom: '1%'
  },
  items: {
    marginTop: '3%'
  },
  pagination: {
    direction: 'row',
    justify: 'center'
  }
});

class BuyersLanding extends Component {
  constructor(props){
    super(props);

    this.state = {
      pageNum: 1,
      perPage: 2,
      categoryId: this.props.match.params.id? this.props.match.params.id: 'root'
    }
  }

  componentDidMount(){
    console.log("App:componentDidMount: ", this.props.match.params);
    this.props.fetchCategory(this.props.match.params.id);
    this.props.fetchItem(this.props.match.params.id, this.state.pageNum, this.state.perPage);
    this.props.fetchItemCount(this.props.match.params.id);
  }

  renderBreadcrumb() {
    const { classes, category:{content:{path}} } = this.props;

    if (!path){
      return [<CircularProgress key={0} className={classes.progress} size={20} />];
    }

    var ret = [];
    for(var i=0;i<path.length;i++){
      const url = `/category/${path[i]._id}`;

      if (i<path.length-1){
        ret.push((<a href={url} key={i*2}>{path[i].title}</a>));
        ret.push((<ChevronRightIcon key={i*2+1}/>));
      } else {
        ret.push((<span href="" key={i*2}>{path[i].title}</span>));
      }
    }

    return ret;
  }

  renderCategories(categories){
    const { classes } = this.props;

    return (
      categories.map((category)=>{
        return (<Chip
            key={category._id}
            label={category.title}
            className={classes.chip}
            component="a"
            href={`/category/${category._id}`}
          />);
      })
    );
  }

  onPageClick(pageNum){
    console.log("onPageClick: pageNum:", pageNum);
    this.setState({
      pageNum: pageNum
    });
    this.props.fetchItem(this.state.categoryId, pageNum, this.state.perPage);
  }

  getPaginationRange(){
      const {pageNum, perPage} = this.state;
      const totalPages = this.props.itemCount.content / perPage;

      let startPage;
      let endPage;

      if (pageNum < 3) {
        startPage = 1;
        endPage = 5;
      } else if (totalPages - pageNum < 3) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = pageNum -2;
        endPage = pageNum +2;
      }
      if (startPage < 1) {
        startPage = 1;
      }
      if (endPage > totalPages) {
        endPage = totalPages;
      }
      return _.range(startPage, endPage+1);
  }

  renderPagination(){
    const { classes, itemCount, item } = this.props;
    const { pageNum } = this.state;

    if (!itemCount.content){
      return (<div>...</div>);
    }

    const activeBtnStyle = {
      fontSize: `120%`
    }

    return (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={16}
            className={classes.pagination}
          >
            {this.getPaginationRange().map(value => {
              return (<Grid key={value} item>
                <button
                  style={value===pageNum? activeBtnStyle:null}
                  disabled={item.ongoing}
                  onClick={()=>this.onPageClick(value)}
                >
                  {value}
                </button>
              </Grid>);
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderSiblingOrChildrenCategories(){
    const { category:{content:{sibling, category}} } = this.props;
    const categoryId = this.props.match.params.id;

    if (!sibling && !category) {
      return <div>...</div>
    }


    let children;
    if (categoryId) {
      children = category.filter(c => c.parentId === categoryId);
    } else {
      const rootCategory = category.find(c => !c.parentId);
      children = category.filter(c => c.parentId === rootCategory._id);
    }

    if (children.length > 0) {
      return this.renderCategories(children);
    } else {
      return this.renderCategories(sibling);
    }

  }

  renderItems(){
    const { classes, item } = this.props;
    if (!item.content || !item.content.length){
      if(!item.ongoing) {
        return <div>There is no item in this category</div>;
      }

      return [<CircularProgress key={0} className={classes.progress} size={20} />];
    }

    return (
      <Grid container spacing={24}>
        {
          item.content.map(item=>{
            return (
              <Grid item className={classes.image} xs={6} sm={3} key={item._id} >
                <img src={item.pictureUrl} alt={item.title} height={180} style={{borderRadius: 5}} />
                <div>${item.price}</div>
              </Grid>
            );
        })}

      </Grid>
    );
  }

  render(){
    const { classes } = this.props;
    return (
        <div className={classes.root} style={{ paddingTop: 64 }}>
          <div>
            {this.renderBreadcrumb()}
          </div>
          <Divider className={classes.divider} />
          <div>
            {this.renderSiblingOrChildrenCategories()}
          </div>
          <Divider className={classes.divider} />
          <div className={classes.items}>
            {this.renderItems()}
          </div>
          <Divider className={classes.divider} />
          <div>
            {this.renderPagination()}
          </div>
        </div>
      );
  }
}

BuyersLanding.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {category: state.category, item: state.item, itemCount: state.itemCount};
}

export default connect(mapStateToProps,{fetchCategory, fetchItem, fetchItemCount})(
  withStyles(styles)(BuyersLanding)
);
