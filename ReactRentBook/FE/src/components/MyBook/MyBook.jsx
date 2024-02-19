import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Spinner,
  Center,
  Card,
  CardBody,
  Image,
  Heading,
  Button,
  useToast,
} from '@chakra-ui/react';
import { BookCard } from '../home/BookCard/BookCard';
import './MyBook.css';
const MyBook = () => {
  const [datas, setDatas] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/myBook', {
          headers: {
            cookie: 'test',
            access_token: localStorage.getItem('accessToken'),
          },
          withCredentials: true,
        });
        if (res.status === 200) {
          setDatas(res.data);
        }
      } catch (err) {
        console.error(err); // Changed 'console.log' to 'console.error' for error logging
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const books = datas.productsWithTimerent;

  const handleClick = async (e) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/postLinkBook',
        {
          productID: e,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        const url = res.data;
        window.location.href = res.data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {IsLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div className='row'>
          {books.map((book) => (
            <>
              <div className='col-lg-4 mb-5'>
                <Card>
                  <CardBody>
                    <div className='card_img'>
                      <div class='overlay'></div>
                      <Image
                        src={
                          'http://localhost:5000/src/public/images/' +
                          book.images
                        }
                        borderRadius='lg'
                        boxSize='lg'
                      />
                      <Button
                        onClick={() => handleClick(book._id)}
                        variant='outline'
                        className='card_btn'
                        colorScheme='red'
                      >
                        Read the book
                      </Button>
                    </div>
                    <Heading className='text-center' size='lg'>
                      {book.name}
                    </Heading>
                  </CardBody>
                </Card>
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default MyBook;
