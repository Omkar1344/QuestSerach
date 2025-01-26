

import React from 'react';
import '../style/Pagination.css'
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  console.log("Pagination Props - Current Page:", currentPage, "Total Pages:", totalPages);  // Debugging Pagination Props

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className='pagination-container'>
      <button
      className='pagination-button'
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className='pagination-info'> Page {currentPage} of {totalPages} </span>
      <button
      className='pagination-button'
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
