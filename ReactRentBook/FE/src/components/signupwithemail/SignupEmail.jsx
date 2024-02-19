import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './signupemail.css';
import { useToast } from '@chakra-ui/react';
const SignupEmail = () => {
  const [email, Setemail] = useState('');
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/user/forgot-password',
        {
          gmail: email,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Email Dispatched Successfully',
          description: 'We just sent your an email, please have a look',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Can not find user',
        description:
          'We cant find your account in our system. Please try again',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <div className='login template d-flex justify-content-center align-items-center 100-vh p-5'>
      <div className='form_container p-5 rounded '>
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Quên mật khẩu</h3>
          <div className='mb-2'>
            <label htmlFor='username'>
              <b>Email</b>
            </label>
            <input
              type='text'
              placeholder='Nhập email'
              className='form-control'
              value={email}
              onChange={(e) => Setemail(e.target.value)}
            />
          </div>
          <button className='btn btn-login h-100 text-white text-center w-100'>
            Gửi
          </button>
          {/* <p className='text-end mt-2'>
            <Link to='/forgotpassword'>Forgot Password?</Link>{' '}
            <Link to='/signup' className='ms-2'>
              Sign up
            </Link>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default SignupEmail;
