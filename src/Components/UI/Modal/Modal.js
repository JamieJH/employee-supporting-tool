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

        this.getModalTitle = this.getModalTitle.bind(this);
        this.closeModalHandler = this.closeModalHandler.bind(this);
        this.getHeadSectionToDisplay = this.getHeadSectionToDisplay.bind(this);
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
        console.log(this.props);
        if (!this.props.title) {
            switch (this.props.type) {
                case "error":
                    return "Failed!";
                case "success":
                    return "Great!";
                case "warning":
                    return "Warning";
                default:
                    return '';
            }
        }
        
        return this.props.title;
    }


    render() {
        const okButtonMessage = this.props.okMessage;
        const cancelButtonMessage = this.props.cancelMessage;

        const okButton = (okButtonMessage !== undefined)
            && <button
                className={styles.okButton}
                onClick={this.onOkButtonClickedHandler}>
                {okButtonMessage}</button>

        const cancelButton = (cancelButtonMessage !== undefined)
            && <button
                className={styles.cancelButton}
                onClick={this.onCancelButtonClickedHandler}>
                {cancelButtonMessage}</button>

        const content = !this.state.isModalOpen ? ''
            : <React.Fragment>
                <Backdrop />
                <div className={styles.container}>
                    {this.getHeadSectionToDisplay()}
                    <div className={styles.content}>
                        <h3>{this.getModalTitle()}</h3>
                        <p>{this.props.content}</p>
                    </div>
                    <div className={styles.buttons}>
                        {okButton}
                        {cancelButton}
                    </div>
                </div>
            </React.Fragment>


        return ReactDOM.createPortal(content, document.getElementById("modal-portal"));
    }
}

export default Modal;