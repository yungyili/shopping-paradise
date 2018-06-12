import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Header from './CheckoutHeader';
import Footer from './CheckoutFooter';
import CheckoutPage1 from './CheckoutPage1';
import CheckoutPage2 from './CheckoutPage2';
import CheckoutPage3 from './CheckoutPage3';
import { withRouter } from 'react-router';

const styles = {
  root: {
    margin: '0',
    marginTop: '3%',
    maxWidth: '900px'
  }
};

class CheckoutPage extends Component {

  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      page: 1
    }
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
  withRouter(CheckoutPage)
);
