import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from '../common/header/Header';
import Home from '../home/Home';
import Details from '../details/details';
import Signin from '../signin/Signin';
import Shop from '../Shop/Shop';
import Genre from '../Genre/Genre';
import Cart from '../Cart/Cart';
import SignupEmail from '../signupwithemail/SignupEmail';
import { Search } from '../Search';
import MyBook from '../MyBook/MyBook';
import ChangePasswordForm from '../signupwithemail/ChangePasswordForm/ChangePasswordForm';
import Payment from '../Payment/Payment';
import Footer from '../common/footer/Footer';
import Signup from '../signup/Signup';

const Pages = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/details/:slug' component={Details} />
          <Route exact path='/signin' component={Signin} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/shop' component={Shop} />
          <Route exact path='/genre/:id' component={Genre} />
          <Route exact path='/cart' component={Cart} />
          <Route exact path='/cart/payment' component={Payment} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/profile' component={MyBook} />
          <Route exact path='/forgotpassword' component={SignupEmail} />
          <Route
            exact
            path='/forgotpassword/changepassword/:id/:token'
            component={ChangePasswordForm}
          />
        </Switch>
        <Footer />
      </Router>
    </>
  );
};

export default Pages;
