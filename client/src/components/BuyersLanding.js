import _ from 'lodash';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import {fetchCategory} from '../actions/categoryActions';
import {fetchCategoryItem, fetchItemCount} from '../actions/itemActions';
import BreadCumb from './BreadCumb';


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
    this.props.fetchCategoryItem(this.props.match.params.id, this.state.pageNum, this.state.perPage);
    this.props.fetchItemCount(this.props.match.params.id);
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

  normalizedPageNum(i){
    const {perPage} = this.state;
    const totalPages = Math.ceil(this.props.itemCount.content / perPage);

    if (i<1){
      return 1;
    } else if (i>totalPages) {
      return totalPages;
    } else {
      return i;
    }
  }

  onPageClick(pageNum){
    console.log("onPageClick: pageNum:", pageNum);
    const normalizedPageNum = this.normalizedPageNum(pageNum);

    this.setState({
      pageNum: normalizedPageNum
    });

    if (normalizedPageNum !== this.state.pageNum) {
      this.props.fetchCategoryItem(this.state.categoryId, normalizedPageNum, this.state.perPage);
    }
  }

  getPaginationRange(){
      const {pageNum, perPage} = this.state;
      const totalPages = Math.ceil(this.props.itemCount.content / perPage);

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
            <Grid key='<<' item>
              <button
                disabled={item.ongoing}
                onClick={()=>this.onPageClick(pageNum-5)}
              >
                {'<<'}
              </button>
            </Grid>

            <Grid key='<' item>
              <button
                disabled={item.ongoing}
                onClick={()=>this.onPageClick(pageNum-1)}
              >
                {'<'}
              </button>
            </Grid>

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

            <Grid key='>' item>
              <button
                disabled={item.ongoing}
                onClick={()=>this.onPageClick(pageNum+1)}
              >
                {'>'}
              </button>
            </Grid>

            <Grid key='>>' item>
              <button
                disabled={item.ongoing}
                onClick={()=>this.onPageClick(pageNum+5)}
              >
                {'>>'}
              </button>
            </Grid>
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
      const rootCategory = category.find(c => c.parentId === undefined);
      if (rootCategory) {
        children = category.filter(c => c.parentId === rootCategory._id);
      } else {
        children = [];
      }
    }

    if (children.length > 0) {
      return this.renderCategories(children);
    } else {
      return this.renderCategories(sibling);
    }

  }

  LinkWrapper = ({ ...props }) => (
    <Link {...props} />
  );

  renderItems(){
    const { classes, item, category } = this.props;

    if (item.ongoing) {
      return (<LinearProgress color="secondary" />)
    }

    if (!item.content || !item.content.length){
        return <div>There is no item in this category</div>;
    }

    return (
      <Grid container spacing={24}>
        {
          item.content.map(item=>{
            return (
              <Grid item
                className={classes.image} xs={6} sm={3}
                key={item._id}
                to={`/item/${item._id}`}
                component={this.LinkWrapper}
              >
                <img
                  src={item.pictureUrl}
                  alt={item.title}
                  height={180}
                  style={{borderRadius: 5}}
                />
                <div>${item.price}</div>
              </Grid>
            );
        })}

      </Grid>
    );
  }

  render(){
    const { classes, category, item, itemCount } = this.props;

    if (category.ongoing || itemCount.ongoing){
      return (<LinearProgress color="secondary" />)
    }

    return (
        <div className={classes.root}>
          <div>
            <BreadCumb path={this.props.category.content.path}/>
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

export default connect(mapStateToProps,{fetchCategory, fetchCategoryItem, fetchItemCount})(
  withStyles(styles)(BuyersLanding)
);
