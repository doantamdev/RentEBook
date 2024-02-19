import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import '../signupemail.css';
import { Center, useToast, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
const ChangePasswordForm = () => {
  const [password, Setpassword] = useState('');
  const [datas, Setdatas] = useState();
  const { id, token } = useParams();
  const [IsLoading, SetIsLoading] = useState(true);
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      const api = `http://localhost:5000/user/reset-password/${id}/${token}`;
      try {
        SetIsLoading(true);
        const response = await axios.get(api);
        if (response.status === 200) {
          console.log(response);
          Setdatas(response.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        SetIsLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log(datas);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/user/reset-password/${id}/${token}`,
        {
          password,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Password changed !',
          description: 'We have updated your new password',
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
    <>
      {IsLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <div className='login template d-flex justify-content-center align-items-center 100-vh p-5'>
          <div className='form_container p-5 rounded '>
            <form onSubmit={handleSubmit}>
              <h3 className='text-center'>Change your Password</h3>
              <div className='mb-2'>
                <label htmlFor='username'>
                  <b>Email</b>
                </label>
                <input
                  type='text'
                  placeholder='Enter your email'
                  className='form-control'
                  value={datas.gmail}
                  disabled
                />
              </div>
              <div className='mb-2'>
                <label htmlFor='username'>
                  <b>New Password</b>
                </label>
                <input
                  type='password'
                  placeholder='Enter your email'
                  className='form-control'
                  value={password}
                  onChange={(e) => Setpassword(e.target.value)}
                />
              </div>
              <button className='btn btn-login h-100 text-white text-center w-100'>
                Submit
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
      )}
    </>
  );
};

export default ChangePasswordForm;
