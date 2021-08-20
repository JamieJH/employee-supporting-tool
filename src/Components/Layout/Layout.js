import React from 'react';
import { useState } from 'react';
import Headbar from '../Headbar/Headbar';
import Sidebar from '../Sidebar/Sidebar';
import PropTypes from 'prop-types';

import styles from './Layout.module.css';

const Layout = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const sidebarToggler = () => {
    setIsOpen(isOpen => !isOpen);
  }

  const closeSidebarHandler = () => {
    setIsOpen(false);
  }
  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isOpen} closeSidebarHandler={closeSidebarHandler} />
      <main className={!isOpen ? styles.collapsed : ''}>
        <Headbar isOpen={isOpen} sidebarToggler={sidebarToggler} />
        <div className={styles.mainContent}>
          {props.children}
        </div>
      </main>
    </div>
  );
}

Layout.propTypes = {
	children: PropTypes.element.isRequired
};

export default Layout
