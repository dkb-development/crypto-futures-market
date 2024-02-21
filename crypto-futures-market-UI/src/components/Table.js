// src/components/Table.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/table.css'; // Import the CSS file

const Table = ({ data, itemsPerPage, headers }) => {
  const symbolVolatilityState = useSelector((state) => state.volatility);
  const [allData, setAllData] = useState(data);
  const [allSortedData, setAllSortedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });

  var indexOfLastItem = currentPage * itemsPerPage;
  var indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [currentItems, setCurrentItems] = useState(allData && allData.slice(indexOfFirstItem, indexOfLastItem));

  const totalPages = Math.ceil(allData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    setAllData(Object.values(symbolVolatilityState));
  }, [symbolVolatilityState])

  useEffect(() => {
    updateSortedData();
  }, [sortConfig]);

  const updateSortedData = () => {
    const sortableData = [...allData];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setAllSortedData(sortableData);
  };

  useEffect(() => {
    updateSortedData();
  },[allData])

  useEffect(() => {
    indexOfLastItem = currentPage * itemsPerPage;
    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(allSortedData && allSortedData.slice(indexOfFirstItem, indexOfLastItem));
    // console.log("All Data ", allData);
  }, [allSortedData, currentPage, itemsPerPage])
  

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {Object.keys(headers).map((key) => (
              <th key={key} onClick={() => requestSort(key)}>
                {headers[key]}
                {sortConfig.key === key && (
                  <span>{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              {Object.keys(headers).map((key) => (
                <td key={key}>{item[key.toLowerCase()]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>
          First
        </button>
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <ul>
          {Array.from({ length: totalPages }).map((_, index) => (
            <li key={index + 1}>
              <button
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
        <button onClick={goToLastPage} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>
    </div>
  );
};

export default Table;
