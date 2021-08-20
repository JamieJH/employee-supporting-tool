import React, { useState } from 'react';
import { IconButton } from '../../../Components';
import classNames from 'classnames';

import styles from './EventDetailsModal.module.css';

const EventDetailsModal = (props) => {

  const [isOpen, setIsOpen] = useState(true);

  const closeModal = (e) => {
    if (e.target.className === 'backdrop') {
      setIsOpen(false);
    }
  }

  const getDateTime = (limit) => {
    if (props.type === 'log') {
      return new Date(props.details[limit]).toLocaleString('en-uk');
    }
    return new Date(props.details[limit]).toLocaleDateString('en-uk');
  }


  return isOpen && (
    <div className='backdrop' onClick={closeModal}>
      <div className={classNames("modalContainer", styles.modalContainer)}>
        <div className={classNames(styles.modalTitle, styles[props.type])}>
          <h2>{props.type}</h2>
          <IconButton type='close' title='close modal' onClick={() => setIsOpen(false)} fontAwesomeCode='fas fa-times' />
        </div>
        <div className={styles.eventContent}>
          <div className={styles.eventDetail}>
            <h3>Start</h3>
            <p>{getDateTime('start')}</p>
          </div>
          <div className={styles.eventDetail}>
            <h3>End</h3>
            <p>{getDateTime('end')}</p>
          </div>
          <div className={styles.eventDetail}>
            <h3>Content</h3>
            <p>{props.details.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;