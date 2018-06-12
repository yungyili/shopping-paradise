import React, {Component} from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Header from './CheckoutHeader';
import Footer from './CheckoutFooter';
import CheckoutPage1 from './CheckoutPage1';
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
    const {classes, onSubmit} = this.props;
    const { page } = this.state;
    return (
      <div className={classes.root} >
        <Header />
          {page === 1 && <CheckoutPage1 onNextPage={this.nextPage} />}
        <Footer />
      </div>
    );
  }
}


export default withStyles(styles)(
  withRouter(CheckoutPage)
);
