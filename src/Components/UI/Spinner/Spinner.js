import React from 'react';
import ReactDOM from 'react-dom';
import Backdrop from '../Backdrop/Backdrop';
import styles from './Spinner.module.css';

const Spinner = () => {
    return ReactDOM.createPortal(
        <React.Fragment>
            <Backdrop />
            <div className={styles.container}>
                <div className={`${styles.spinner} ${styles.spinnerOne}`}>
                    {/* <div className={`${styles.spinner} ${styles.spinnerTwo}`}></div> */}
                </div>
            </div>
        </React.Fragment>,

        document.getElementById("spinner-portal")
    );
}

export default Spinner;