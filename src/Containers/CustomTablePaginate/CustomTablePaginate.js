import classNames from 'classnames';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { CustomTable } from '../../Components';
import PropTypes from 'prop-types';

import styles from './CustomTablePaginate.module.css';

const PER_PAGE = 10;

const CustomTablePaginate = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const allItems = props.items;
  const totalPage = Math.ceil(props.items.length / PER_PAGE);
  const OneItemComponent = props.oneItemComponent;

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage)
  }

  const currentPageData = (offset) => {
    if (allItems && allItems.length === 0) {
      return <tr><td colSpan={props.maxCol}>There are currently data for this section</td></tr>;
    }
    else {
      const currentPageItems = allItems.slice(offset, offset + PER_PAGE);
      const tablePageData = currentPageItems.map(item => {
        return (
          <OneItemComponent key={item.id} details={item} />
        )
      })

      // fill up remaining spaces if available (for aesthetic purpose)
      if (currentPageItems.length < PER_PAGE) {
        Array(PER_PAGE - currentPageItems.length).fill(0).forEach((_, index) => {
          // const rowFiller = Array(props.maxCol).fill(0).map((_, index) => <td key={index}></td>);
          tablePageData.push(<tr key={index}><td colSpan={props.maxCol}></td></tr>);
        })
      }

      return tablePageData;
    }

  }

  return (
    <React.Fragment>
      <CustomTable>
          <thead>
            <tr>
              {props.children}
            </tr>
          </thead>
          <tbody>
            {currentPageData(currentPage * PER_PAGE)}
          </tbody>
      </CustomTable>

      {allItems.length !== 0 &&
        <ReactPaginate
          previousLabel={<i className="fas fa-chevron-left"></i>}
          nextLabel={<i className="fas fa-chevron-right"></i>}
          pageCount={totalPage}
          marginPagesDisplayed={2}    // pages dispayed at start and end
          pageRangeDisplayed={2}      // pages displayed at start
          onPageChange={handlePageClick}
          containerClassName={styles.pagination}
          subContainerClassName={classNames(styles.pages, styles.pagination)}
          activeClassName={styles.active}
          forcePage={currentPage}
        />
      }

    </React.Fragment>
  );
}

CustomTablePaginate.propTypes = {
	children: PropTypes.array.isRequired,
	items: PropTypes.array,
	oneItemComponent: PropTypes.elementType,
	maxCol: PropTypes.number,
};

export default CustomTablePaginate;