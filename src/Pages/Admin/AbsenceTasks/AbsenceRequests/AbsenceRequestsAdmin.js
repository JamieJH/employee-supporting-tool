import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import Spinner from '../../../../Components/UI/Spinner/Spinner';
import PageHeader from '../../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../../Components/UI/PageMainContainer/PageMainContainer';
import OneAbsenceRequest from './OneAbsenceRequest/OneAbsenceRequest';
import AddDataButton from '../../../../Components/UI/AddDataButton/AddDataButton';
import CustomTable from '../../../../Components/CustomTable/CustomTable';

import styles from './AbsenceRequestsAdmin.module.css';

class AbsenceRequestsAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            requests: null
        }

        this.getRequestsContentToDisplay = this.getRequestsContentToDisplay.bind(this);
    }

    componentDidMount() {
        firebase.database().ref('/absence-requests')
            .once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(data => {
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
            return <OneAbsenceRequest key={request.id} details={request} />;
        })
    }

    render() {
        return (!this.state.requests)
            ? <Spinner />
            : (
                <React.Fragment>
                    <PageHeader
                        title="Absent Requests"
                        description="Review, approve, or deny requests"
                    />
                    <AddDataButton title="Add Request" path="/new-request" />
                    <PageMainContainer>
                        <CustomTable>
                            <thead>
                                <tr>
                                    <th className={styles.name}>Name</th>
                                    <th className={styles.duration}>duration</th>
                                    <th className={styles.reason}>Reason</th>
                                    <th className={styles.status}>Status</th>
                                    <th className={styles.processor}>processor</th>
                                    <th className={styles.actions}>Actions</th>
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

export default AbsenceRequestsAdmin;