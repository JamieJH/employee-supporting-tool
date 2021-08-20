import React from 'react';
import PropTypes from 'prop-types';

import styles from './FunctionButton.module.css';

const FunctionButton = (props) => {
  const getFunctionButton = () => {
    if (props.action === 'add' || !props.isInputsDisabled) {
      return <button key="submit-btn" type="submit"
        className={styles.saveButton}
        onClick={props.onClick}>
        {props.saveButtonText || "Save"}</button>
    }
    else {
      return <button key="regular-btn" type="button" onClick={props.enabledInputs} className={styles.editButton}>Edit</button>
    }
  }


  return (
    <div className={styles.buttons}>
      {getFunctionButton()}
    </div>
  )

}

FunctionButton.propTypes = {
  saveButtonText: PropTypes.string,
	onClick: PropTypes.func,
	isInputsDisabled: PropTypes.bool,
	action: PropTypes.string,
	enabledInputs: PropTypes.func,
};

export default FunctionButton;