import React, { useEffect, useState } from 'react';
import { Container, Grid, GridItem, Input, Spinner } from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import { BookCard } from '../home/BookCard/BookCard';
import './search.css';
export function Search() {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedValue] = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(false);
  console.log(debouncedValue);
  useEffect(() => {
    async function SearchedMovies() {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `http://localhost:5000/search?q=${debouncedValue}`,
        );
        setSearchedBooks(res.data.books);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (debouncedValue !== '') {
      SearchedMovies();
    }
  }, [debouncedValue]);
  return (
    <>
      <div className='search'>
        <Container maxW='1440px' pt='125px'>
          <div className='title'>
            <h2>Find your favorite books</h2>
          </div>
          <Input
            mb='24px'
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Tìm sách của bạn'
            _placeholder={{ opacity: 0.4, color: 'inherit' }}
          />
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={5}
            className='booksearch'
          >
            {searchedBooks.map((book) => (
              <GridItem key={book.id}>
                <BookCard book={book}></BookCard>
              </GridItem>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
}
