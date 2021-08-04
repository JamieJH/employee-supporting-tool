import React from 'react';

import styles from './IconButton.module.css';

const IconButton = (props) => {
    // const buttonIcon = props.htmlCode
    //     ? <span>{props.htmlCode}</span>
    //     : <i className={`fas ${props.fontAwesomeCode}`}></i>

    return (
        <button className={`${styles.button} ${styles[props.type]}`} onClick={props.onClick} title={props.title}>
            <i className={`fas ${props.fontAwesomeCode}`}></i>
        </button>
    );
}

export default IconButton;