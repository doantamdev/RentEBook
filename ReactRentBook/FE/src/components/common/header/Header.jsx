import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { nav } from '../../data/Data';
import './header.css';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const Header = () => {
  const [navList, setNavList] = useState(false);
  const history = useHistory();
  const [isLogin, SetIsLogin] = useState(false);
  const toast = useToast();
  useEffect(() => {
    // Check if the access token exists in local storage
    const accessToken = localStorage.getItem('accessToken');
    SetIsLogin(!!accessToken);
  }, [isLogin]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/user/logout',
        {},
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Logout successfully',
          description: 'You have logged out successfully.',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        localStorage.removeItem('accessToken');
        SetIsLogin(false);
        setTimeout(() => {
          history.push('/signin');
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <div className='container flex'>
        <div className='logo'>
          <img
            src='https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/logo-1.svg'
            alt='Company Logo'
          />
        </div>

        <nav className='nav'>
          <div className='d-flex gap-5 p-0'>
            <ul className={navList ? 'small' : 'flex'}>
              {nav.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>{item.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className='icon-header'>
          <div className='d-flex align-items-center gap-3'>
            <Link to='/search' className='' aria-label='Search'>
              <i className='fa-solid fa-magnifying-glass'></i>
            </Link>
            <div className='user-menu'>
              <button
                className='action-btn dropdown-toggle'
                id='dropdownMenuButton'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
              >
                <i className='fa-regular fa-user'></i>
              </button>
              <div
                className='dropdown-menu'
                aria-labelledby='dropdownMenuButton'
              >
                {!isLogin ? (
                  <>
                    <Link className='m-0 dropdown-item' to='/signin'>
                      Sign in
                    </Link>
                    <Link
                      className='signup-btn text-white m-0 dropdown-item'
                      to='/signup'
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link className='m-0 dropdown-item' to='/profile'>
                      Profile
                    </Link>
                    <Link className='m-0 dropdown-item' to='/settings'>
                      Settings
                    </Link>
                    <Link
                      onClick={handleLogout}
                      className='m-0 text-danger dropdown-item'
                      to='/logout'
                    >
                      Logout
                    </Link>
                  </>
                )}
              </div>
            </div>
            <Link to='/cart' className='m-0' aria-label='Cart'>
              <i className='fa-solid fa-cart-shopping'></i>
            </Link>
          </div>
        </div>

        <div className='toggle'>
          <button onClick={() => setNavList(!navList)}>
            {navList ? (
              <i className='fa fa-times'></i>
            ) : (
              <i className='fa fa-bars'></i>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
