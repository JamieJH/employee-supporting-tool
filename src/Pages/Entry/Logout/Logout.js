import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import { logout } from '../../../redux/actions/authActions'
import firebase from 'firebase/app';
import 'firebase/auth'; 

class Logout extends Component {

    componentDidMount() {
        firebase.auth().signOut();
        this.props.logout();
        this.props.history.replace('/login');
    }

    render() {
        return (
            <Spinner />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout())
    }
}

export default connect(null, mapDispatchToProps)(Logout);