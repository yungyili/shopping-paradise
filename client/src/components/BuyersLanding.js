import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {fetchCategory} from '../actions/categoryActions';
import {fetchItem} from '../actions/itemActions';
import CircularProgress from '@material-ui/core/CircularProgress';

class BuyersLanding extends Component {
  componentDidMount(){
    console.log("App:componentDidMount: ", this.props.match.params);
    this.props.fetchCategory(this.props.match.params.id);
    this.props.fetchItem(this.props.match.params.id);
  }

  renderBreadcrumb() {
    const { classes, category:{content:{path}} } = this.props;

    if (!path){
      return [<CircularProgress key={0} className={classes.progress} size={20} />];
    }
    console.log("renderBreadcrumb: path:", path);
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
    console.log("renderBreadcrumb: ret:", ret);
    return ret;
  }

  renderItems(){
    return (
      <div>
        items
      </div>
    );
  }

  render(){
    const { classes } = this.props;
    console.log("BuyersLanding: render:", this.props.category);
    return (
        <div className={classes.root} style={{ paddingTop: 64 }}>
          <div>
            {this.renderBreadcrumb()}
          </div>
          <div>
            {this.renderItems()}
          </div>
        </div>
      );
  }
}

BuyersLanding.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state){
  return {category: state.category};
}

export default connect(mapStateToProps,{fetchCategory, fetchItem})(
  withStyles({})(BuyersLanding)
);
