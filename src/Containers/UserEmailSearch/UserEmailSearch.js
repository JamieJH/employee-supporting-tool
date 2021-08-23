import React, { useState, useEffect, useCallback, useRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

import styles from './UserEmailSearch.module.css';

const UserEmailSearch = (props) => {
  const { email, updateEmail, onUserEmailSelected } = props;
  const [userList, setUserList] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(true);
  const [userListDropdownOtions, setUserListDropDownOptions] = useState([]);
  const searchEmployeeTimeoutRef = useRef(null);

  // console.log(email);
  // console.log(userList);
  // console.log(isDropdownOpen);
  // console.log(userListDropdownOtions);

  const getEmployeeListFromEmailInput = useCallback(
    () => {
      firebase.database().ref('/users').orderByChild('email')
        .startAt(email)
        .endAt(email + '\uf8ff')
        .once('value')
        .then(snapshot => snapshot.val())
        .then(users => {
          if (users) {
            for (const [userId, user] of Object.entries(users)) {
              user.id = userId;
            }
            setUserList(users);
          }
          else {
            setUserList({});
          }
        })
    },
    [email]
  )

  useEffect(() => {
    getEmployeeListFromEmailInput();
    document.addEventListener('mousedown', onClickOutsideInputAndDropdown);

    return () => {
      document.removeEventListener('mousedown', onClickOutsideInputAndDropdown);
    }
  }, [getEmployeeListFromEmailInput])

  const onClickOutsideInputAndDropdown = (e) => {
    if (e.target.className !== 'dropdownItem' && e.target.id !== 'email') {
      setIsDropdownOpen(false);
    }
  }

  // debounce and search for employee matching the input email on email change
  useEffect(() => {
    if (!isOptionSelected) {
      if (searchEmployeeTimeoutRef.current) {
        clearTimeout(searchEmployeeTimeoutRef.current);
      }

      searchEmployeeTimeoutRef.current = setTimeout(() => {
        getEmployeeListFromEmailInput();
      }, 300)
    }
  }, [email, isOptionSelected, getEmployeeListFromEmailInput])


  // update employee list dropdown selector when userList changes
  useEffect(() => {
    if (userList) {
      const onDropdownItemSelected = (e) => {
        setIsOptionSelected(true);
        setIsDropdownOpen(false);
        const userId = e.target.id;
        const email = e.target.innerText;
        const user = userList[userId];

        updateEmail(email);
        onUserEmailSelected(user);
      }

      const dropdownOptions = Object.keys(userList).map(userId => {
        return <p key={userId} id={userId} className='dropdownItem' onClick={onDropdownItemSelected}>{userList[userId].email}</p>
      })
      setUserListDropDownOptions(dropdownOptions);
    }
  }, [userList, updateEmail, onUserEmailSelected])


  const onEmailInputChange = (e) => {
    updateEmail(e.target.value);
  }

  return (
    <React.Fragment>
      <div className="formInput">
        <label htmlFor="email" >Employee Email</label>
        <input type="text" id="email" name='email'
          placeholder="Example: emailaddress@domain.abc"
          pattern="^[a-z0-9.]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          title="Must be in format 'emailaddress@domain.abc'"
          value={email}
          onChange={onEmailInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          autoComplete="nope"
          required />
      </div>
      {/* autoComplete="off" doesnot work, it has to be set to some invalid value*/}

      {isDropdownOpen && (
        <div className={styles.employeesDropdown}>
          {userListDropdownOtions}
        </div>
      )}
    </React.Fragment>
  );
}

export default UserEmailSearch;