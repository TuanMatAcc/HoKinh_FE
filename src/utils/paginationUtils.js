// paginationUtils.js
export const goToNext = ({ currentPage, setCurrentPage, totalPages }) => {
  if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
};

export const goToPrev = ({ currentPage, setCurrentPage }) => {
  if (currentPage > 0) setCurrentPage(currentPage - 1);
};
