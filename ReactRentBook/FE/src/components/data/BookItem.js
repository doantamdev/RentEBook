import React from 'react';
import './imgbook/book.css';

function BookItem({ book }) {
  return (
    <div className='bookItem'>
      {/* <img src={book.image} alt='imgbook' /> */}
      <h1> {book.name} </h1>
      <p></p>
      <p> ${book.price} </p>
    </div>
  );
}

export default BookItem;
