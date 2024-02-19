import React from 'react';
import Carousel from 'react-elastic-carousel';
import './genres.css';
import Genres from '../data/Genres';
import { genresname } from '../data/Genresname';

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2 },
  { width: 768, itemsToShow: 3 },
  { width: 1200, itemsToShow: 3 },
];

const GenresBook = () => {
  return (
    <>
      <h1 style={{ textAlign: 'left', marginLeft: 50 }}>Thể loại sách</h1>
      <div className='GenresBook mb-4'>
        <Carousel
          breakPoints={breakPoints}
          disableArrowsOnEnd={true}
          showArrows={false}
          pagination={false}
        >
          {genresname.map((genresname, index, id) => (
            <Genres
              key={index}
              genresname={genresname.genresname}
              image={genresname.image}
              id={genresname.id}
            />
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default GenresBook;
