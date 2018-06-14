import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import Header from './SellHeader';
import Footer from './SellFooter';

const styles = theme => ({

});

class SellPage extends Component {

  render() {

    return (
      <div>
        <Header />
        ...
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(
  withRouter(
    SellPage
  )
);
