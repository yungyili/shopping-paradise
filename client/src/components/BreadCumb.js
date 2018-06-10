import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
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

const BreadCumb = (props) => {
    const { classes, path, tailLink } = props;

    if (!path){
      return <div>...</div>;
    }

    path.sort(function(a,b){
      return a.lft - b.lft;
    })

    var ret = [];
    for(var i=0;i<path.length;i++){
      const url = `/category/${path[i]._id}`;

      if (i === path.length-1){
        if (tailLink){
          ret.push((<a href={url} key={i*2}>{path[i].title}</a>));
        } else {
          ret.push((<span href="" key={i*2}>{path[i].title}</span>));
        }
      } else {
        ret.push((<a href={url} key={i*2}>{path[i].title}</a>));
        ret.push((<ChevronRightIcon key={i*2+1}/>));
      }
    }

    return ret;
}

export default withStyles(styles)(BreadCumb);
