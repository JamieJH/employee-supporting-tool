import React, { Component } from 'react';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import { Link } from 'react-router-dom';
import PageHeader from '../../../Components/UI/PageHeader/PageHeader';
import PageMainContainer from '../../../Components/UI/PageMainContainer/PageMainContainer';
import OneEmployee from './OneEmployee/OneEmployee';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './AllEmployees.module.css';

class AllEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: null,
            isAllChecked: false,
        }

        this.tableRef = React.createRef();

        this.checkAllHandler = this.checkAllHandler.bind(this);
        this.getEmployeeContentToDisplay = this.getEmployeeContentToDisplay.bind(this);
    }

    componentDidMount() {
        const usersDbRef = firebase.database().ref('/users');

        usersDbRef.orderByChild('role').equalTo('employee').once('value')
            .then(snapshot => {
                return snapshot.val();
            })
            .then(users => {
                const employees = [];
                for (const [id, userDetails] of Object.entries(users)) {
                    userDetails.id = id;
                    employees.push(userDetails);
                }

                this.setState({
                    employees: employees
                })
            })
    }

    checkAllHandler() {
        const tableElement = this.tableRef.current;
        const checkboxes = tableElement.querySelectorAll("input[type='checkbox']");

        let togglerMethod = (this.state.isAllChecked)
            ? (input) => { input.removeAttribute("checked") }
            : (input) => { input.setAttribute("checked", true) };

        checkboxes.forEach(checkbox => {
            togglerMethod(checkbox);
        })

        this.setState(state => {
            return {
                isAllChecked: !state.isAllChecked
            }
        });
    }


    getEmployeeContentToDisplay() {
        const employeesList = this.state.employees

        if (employeesList && employeesList.length === 0) {
            return <tr><td colSpan="5">There are currently no employee</td></tr>;
        }

        return employeesList.map(employee => {
            return <OneEmployee key={employee.id} details={employee} />;
        })
    }

    render() {
        return (!this.state.employees)
            ? <Spinner />
            : (
                <React.Fragment>
                    <PageHeader
                        title="Employee List"
                        description="Review, remove an employee"
                    />
                    <div className={styles.buttons}>
                        <Link className={styles.addUserBtn} to="/add-user">
                            <i className="fas fa-plus"></i>
                            <span>Add New User</span>
                        </Link>

                    </div>
                    <PageMainContainer >
                        <div className={styles.container}>
                            <table className={styles.table} ref={this.tableRef}>
                                <thead>
                                    <tr>
                                        <th className={styles.checkbox}>
                                            <input type="checkbox" id="checkbox-all" onChange={this.checkAllHandler} />
                                            <label htmlFor="checkbox-all"></label>
                                        </th>
                                        <th className={styles.name}>Name</th>
                                        <th className={styles.position}>Position</th>
                                        <th className={styles.date}>Date Started</th>
                                        <th className={styles.actions}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.getEmployeeContentToDisplay()}
                                </tbody>
                            </table>
                        </div>

                    </PageMainContainer>
                </React.Fragment>
            );
    }
}

export default AllEmployees;