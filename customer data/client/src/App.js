import React, { useState, useEffect } from 'react';
import {format, toDate, getHours, getMinutes, parse} from 'date-fns';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateList, setUpdateList] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [itemOffset, setItemOffset] = useState(0);


  //const date = parse(item.createdAt);
  //const hours = getHours(date);
  //const minutes = getMinutes(date);
  //const formattedDate = `${hours}:${minutes}`;

  useEffect(() => {
    getData();
  }, []);

  const convertor = item => ({id: item.s_no, customerName: item.customer_name, location: item.location, phone: item.phone, date: format(item.created_at, "MM/dd/yyyy"), time: `${getHours(item.created_at)}:${getMinutes(item.created_at)}`})
  

  const getData = async () => {
    axios.get('http://localhost:3000')
      .then(response => {
        const update = response.data.map(each => convertor(each));
        setData(update);
        setUpdateList(update);
      })
      .catch(error => {
        console.log(error.message);
      });
    
  }

  const getDataBySort = async (value) => {
    axios.get(`http://localhost:3000/api/sort/?sortBy=${value}`)
      .then(response => {
        const update = response.data.map(each => convertor(each));
        setData(update);
        setUpdateList(update);
        setSortBy(value);
      })
      .catch(error => {
        console.log(error.message);
      });
    
  }

  

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    const update = data.filter(each => each.customerName.includes(e.target.value));
    setUpdateList(update);
    };

  

  const handleSort = async e => {
    console.log(e.target.value);
    getDataBySort(e.target.value);
  };

  function Items({ currentItems }) {
    return (
      <>
        {currentItems &&
          currentItems.map(each => <tr key={each.id}>
            <td>{each.id}</td>
            <td>{each.customerName}</td>
            <td>{each.age}</td>
            <td>{each.phone}</td>
            <td>{each.location}</td>
            <td>{each.date}</td>
            <td>{each.time}</td>
          </tr>)}
      </>
    );
  }
  
  
   
    const itemsPerPage = 20;
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = updateList.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % data.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

  return (
    <div className="main-container">

      <input type="text" placeholder="Search..." onChange={handleSearch} value={searchTerm}/>
      <select onChange={handleSort} value={sortBy}>
        <option value="">Sort By</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <Items currentItems={currentItems} />
        </tbody>
      </table>
      <ReactPaginate
        className='pagination'
        breakLabel="..."
        nextLabel="next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="previous"
        renderOnZeroPageCount={null}
      />
      
    </div>
  );
}

export default App;
