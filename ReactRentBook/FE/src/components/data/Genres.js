import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom';
const Genres = ({ genresname, image, id }) => {
  const divStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'fit-content',
  };

  return (
    <div className='genres' style={divStyle}>
      <Link to={`genre/${id}`}>
        <div className='genresname'>{genresname}</div>
      </Link>
    </div>
  );
};

export default Genres;
