import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './signup.css';
import { useToast } from '@chakra-ui/react';
const Signup = () => {
  const [username, Setusername] = useState('');
  const [password, Setpassword] = useState('');
  const [email, SetEmail] = useState('');

  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/user/register',
        {
          username,
          password,
          gmail: email,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Signup successfully',
          description: 'You have signed up successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
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
          <h3 className='text-center'>Đăng ký</h3>
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
          <div className='mb-2'>
            <label htmlFor='text'>
              <b>Email</b>
            </label>
            <input
              value={email}
              onChange={(e) => SetEmail(e.target.value)}
              type='email'
              placeholder='Nhập email'
              className='form-control'
            />
          </div>
          <button className='btn btn-signup h-100 text-white text-center w-100'>
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
