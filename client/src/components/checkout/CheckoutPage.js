import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import Header from './CheckoutHeader';
import Footer from '../Footer';
import CheckoutPage1 from './CheckoutPage1';
import CheckoutPage2 from './CheckoutPage2';
import CheckoutPage3 from './CheckoutPage3';
import { withRouter } from 'react-router';
import {setCurrentOrder} from '../../actions/orderActions';


const styles = {
  root: {
    margin: '2em 1em',
    maxWidth: '900px'
  }
};

class CheckoutPage extends Component {

  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    const page = this.props.pageNum? this.props.pageNum: 1;
    this.state = {
      page: page
    }
  }

  componentWillUnmount(){
    // this.props.setCurrentOrder({
    //   items: null,
    //   payment: null,
    //   receiverName: null,
    //   receiverAddress: null
    // });
  }

  nextPage() {
    this.setState({ page: this.state.page + 1 });
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 });
  }

  render() {
    const {classes} = this.props;
    const { page } = this.state;
    return (
      <div className={classes.root} >
        <Header />
          {page === 1 && <CheckoutPage1 onNextPage={this.nextPage} />}
          {page === 2 && <CheckoutPage2 onNextPage={this.nextPage} onPreviousPage={this.previousPage} />}
          {page === 3 && <CheckoutPage3 />}
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles)(
  connect(null,{setCurrentOrder})(
    withRouter(CheckoutPage)
  )
);
