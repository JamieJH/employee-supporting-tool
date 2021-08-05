import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import OneAbsenceRequestEmployee from './OneAbsenceRequestEmployee/OneAbsenceRequestEmployee';
import AddDataButton from '../../../../Components/UI/AddDataButton/AddDataButton';
import CustomTable from '../../../../Components/CustomTable/CustomTable';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AbsenceRequestsEmployee.module.css';

class AbsenceRequestsEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            requests: null
        }

        this.getRequestsContentToDisplay = this.getRequestsContentToDisplay.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('/absence-requests').orderByChild('employeeId').equalTo(this.props.employeeId)
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(data => {
                console.log(data);
                const requests = [];
                for (const [id, details] of Object.entries(data)) {
                    details.id = id;
                    requests.push(details);
                }

                this.setState({
                    isLoading: false,
                    requests: requests
                })
            })
    }

    getRequestsContentToDisplay() {
        const requests = this.state.requests;

        if (requests && requests.length === 0) {
            return <tr><td colSpan="5">There are currently no requests</td></tr>;
        }

        return requests.map(request => {
            return <OneAbsenceRequestEmployee key={request.id} details={request} />;
        })
    }

    render() {
        return (!this.state.requests)
            ? <Spinner />
            : (
                <React.Fragment>
                    <PageHeader
                        title="Absent Requests"
                        description="Review all absence requests you have made."
                    />
                    <div className={styles.buttons}>
                        <AddDataButton title="New Request" path="/new-request-employee" />
                    </div>
                    <PageMainContainer>
                        <CustomTable>
                            <thead>
                                <tr>
                                    <th className={styles.reason}>Reason</th>
                                    <th className={styles.duration}>duration</th>
                                    <th className={styles.status}>Status</th>
                                    <th className={styles.processor}>processor</th>
                                    <th className={styles.processorComment}>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.getRequestsContentToDisplay()}
                            </tbody>
                        </CustomTable>

                    </PageMainContainer>
                </React.Fragment>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        employeeId: state.auth.userId
    }
}

export default connect(mapStateToProps, null)(AbsenceRequestsEmployee);