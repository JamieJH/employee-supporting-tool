import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Backdrop from '../Backdrop/Backdrop';

import styles from './Modal.module.css';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: true
        }

        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.onOkButtonClickedHandler = this.onOkButtonClickedHandler.bind(this);
        this.onCancelButtonClickedHandler = this.onCancelButtonClickedHandler.bind(this);
    }

    closeModalHandler() {
        this.setState({ isModalOpen: false });
    }

    onOkButtonClickedHandler() {
        this.closeModalHandler();
        if (this.props.okButtonHandler) {
            this.props.okButtonHandler();
        }
    }

    onCancelButtonClickedHandler() {
        this.closeModalHandler();
        if (this.props.cancelButtonHandler) {
            this.props.cancelButtonHandler();
        }
    }

    getHeadSectionToDisplay() {
        const modalType = this.props.type;
        const className = `${styles.head} ${modalType ? styles[modalType] : ''}`;
        let icon = <span className={styles.icon}>&#33;</span>;

        if (modalType === "success") {
            icon = <span className={styles.icon}>&#10003;</span>;
        }
        else if (modalType === "error") {
            icon = <span className={styles.icon}>&#10005;</span>;
        }

        return <div className={className}>
            {icon}
            <button className={styles.closeButton} onClick={this.closeModalHandler}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    }

    getModalTitle() {
        if (!this.props.title) {
            switch (this.props.type) {
                case "error":
                    return "Failed!";
                case "success":
                    return "Great!";
                case "warning":
                    return "Are you sure?";
                default:
                    return '';
            }
        }
        
        return this.props.title;
    }

    getModalContent() {
        if (this.props.type === 'error' && !this.props.content) {
            return 'Something went wrong, please try again later!';
        }

        return this.props.content;
    }


    render() {
        const cancelButton = (this.props.type === 'warning')
            && <button
                className={styles.cancelButton}
                onClick={this.onCancelButtonClickedHandler}>
                {this.props.cancelMessage || 'Cancel'}</button>

        const content = !this.state.isModalOpen ? ''
            : <React.Fragment>
                <Backdrop />
                <div className={styles.container}>
                    {this.getHeadSectionToDisplay()}
                    <div className={styles.content}>
                        <h3>{this.getModalTitle()}</h3>
                        <p>{this.getModalContent()}</p>
                    </div>
                    <div className={styles.buttons}>
                        <button
                            className={styles.okButton}
                            onClick={this.onOkButtonClickedHandler}
                            >{this.props.type === 'warning' ? 'Continue' : 'OK'}</button>
                        {cancelButton}
                    </div>
                </div>
            </React.Fragment>


        return ReactDOM.createPortal(content, document.getElementById("modal-portal"));
    }
}

export default Modal;