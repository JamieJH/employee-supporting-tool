import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import * as actionCreators from '../../redux/actions/actionCreators';
import ReactDOM from 'react-dom';

import styles from './Modal.module.css';

const Modal = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector(state => state.modalSpinner.isModalOpen);
	const modalDetails = useSelector(state => state.modalSpinner.modalDetails);

	const closeModalHandler = () => {
		dispatch(actionCreators.closeModal());
	}

	const onOkButtonClickedHandler = () => {
		closeModalHandler();
		if (modalDetails.okButtonHandler) {
			modalDetails.okButtonHandler();
		}
	}

	const onCancelButtonClickedHandler = () => {
		closeModalHandler();
		if (modalDetails.cancelButtonHandler) {
			modalDetails.cancelButtonHandler();
		}
	}

	const getTitleToDisplay = () => {
		const modalType = modalDetails.type;

		if (modalType === "success") {
			return <span className={styles.icon}>&#10003;</span>;
		}
		else if (modalType === "warning") {
			return <span className={styles.icon}>&#33;</span>;
		}
		else {
			// if 'type' is not specified, the modal is an error modal
			return <span className={styles.icon}>&#10005;</span>;
		}
	}

	const getModalTitle = () => {
		if (!modalDetails.title) {
			switch (modalDetails.type) {
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

		return modalDetails.title;
	}

	const getModalContent = () => {
		if (modalDetails.type === 'error' && !modalDetails.content) {
			return 'Something went wrong, please try again later!';
		}

		return modalDetails.content;
	}

	const getCancelButton = () => {
		return (modalDetails.type === 'warning')
			&& <button
				className={styles.cancelButton}
				onClick={onCancelButtonClickedHandler}>
				{modalDetails.cancelMessage || 'Cancel'}</button>
	}



	const content = !isOpen ? ''
		: <React.Fragment>
			{/* <Backdrop /> */}
			<div className='backdrop'>
				<div className="modalContainer">
					<div className={classNames(styles.head, styles[modalDetails.type])}>
						{getTitleToDisplay()}
						<button className={styles.closeButton} onClick={closeModalHandler}>
							<i className="fas fa-times"></i>
						</button>
					</div>
					<div className={styles.content}>
						<h3>{getModalTitle()}</h3>
						<p>{getModalContent()}</p>
					</div>
					<div className={styles.buttons}>
						<button
							className={styles.okButton}
							onClick={onOkButtonClickedHandler}
						>{modalDetails.type === 'warning' ? 'Continue' : 'OK'}</button>
						{getCancelButton()}
					</div>
				</div>
			</div>
		</React.Fragment>


	return ReactDOM.createPortal(content, document.getElementById("modal-portal"));

}

export default Modal;