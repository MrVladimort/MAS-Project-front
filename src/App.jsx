import React from 'react';
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import HomePage from "./components/pages/HomePage";

import UserPage from "./components/pages/UserPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import OrderPage from "./components/pages/OrderPage";

import Header from "./components/baseComponents/Header";
import Footer from "./components/baseComponents/Footer";

import PrivateRoute from "./components/utilComponents/PrivateRoute";

import "./assets/css/default.min.css";
import "semantic-ui-css/semantic.min.css";
import "react-datepicker/dist/react-datepicker.css";

const App = ({ location, dispatch, history }) => (
    <div className="reactBody">
      <Header location={location} dispatch={dispatch} history={history}/>
      <div className='content'>
        <Route location={location} path="/" exact component={HomePage}/>
        <Route location={location} path="/login" exact component={LoginPage}/>

        <PrivateRoute location={location} path="/order/add" exact component={OrderPage}/>


        <PrivateRoute location={location} path="/user" component={UserPage}/>
        <Route location={location} path="/register" exact component={RegisterPage}/>
      </div>
      <Footer/>
    </div>
);

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isAuth: !!state.auth.token,
    user: state.user,
});

export default connect(mapStateToProps)(App);
