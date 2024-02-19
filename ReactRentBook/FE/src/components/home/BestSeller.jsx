import React, { useEffect, useState } from 'react';
import { BookCard } from './BookCard/BookCard';
import { Center, Spinner } from '@chakra-ui/react';
import axios from 'axios';

const BestSeller = () => {
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const api = 'http://localhost:5000/';

      try {
        setIsLoading(true);
        const response = await axios.get(api);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const firstSixBooks = response.data.books.slice(0, 6);
        setDatas(firstSixBooks);
      } catch (error) {
        console.error('API request error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div className='menu'>
          <h1 className='menuTitle'>Sách Yêu Thích</h1>
          <div className='menuList'>
            {datas.map((book) => (
              <div key={book.id} className=''>
                <BookCard book={book}></BookCard>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BestSeller;
