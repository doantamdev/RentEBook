import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Signin.css';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
const Signin = () => {
  const [username, Setusername] = useState('');
  const [password, Setpassword] = useState('');
  const history = useHistory();
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/user/login',
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('userName', res.data.username);
        toast({
          title: 'Login successfully',
          description: 'You have logged in successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setTimeout(() => {
          history.push('/');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: 'Wrong password',
        description: 'Your password is incorrect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <div className='login template d-flex justify-content-center align-items-center 100-vh p-5'>
      <div className='form_container p-5 rounded '>
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Đăng nhập</h3>
          <div className='mb-2'>
            <label htmlFor='username'>
              <b>Tài khoản</b>
            </label>
            <input
              type='text'
              placeholder='Nhập tài khoản'
              className='form-control'
              value={username}
              onChange={(e) => Setusername(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='password'>
              <b>Mật khẩu</b>
            </label>
            <input
              type='password'
              placeholder='Nhập mật khẩu'
              className='form-control'
              value={password}
              onChange={(e) => Setpassword(e.target.value)}
            />
          </div>
          <button className='btn btn-login h-100 text-white text-center w-100'>
            Đăng nhập
          </button>
          <p className='text-end mt-2'>
            <Link to='/forgotpassword'>Quên mật khẩu?</Link>{' '}
            <Link to='/signup' className='ms-2'>
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
