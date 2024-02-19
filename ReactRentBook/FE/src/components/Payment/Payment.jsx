import React, { useEffect, useState } from 'react';
import { Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import '../Cart/Cart.css';

const Payment = () => {
  const [datas, setDatas] = useState([]); // Initialize with an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/order/create_payment_url',
        null,
        { withCredentials: true },
      );
      if (res.status === 200) {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        const response = await axios.post(
          'http://localhost:5000/order/create-order',
          null,
          { withCredentials: true },
        );
        if (response.status === 200) {
          console.log(response);
        }
        window.location.href = res.data;
      }
    } catch (err) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/order/', {
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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cartItems = datas.cartItems;
  const formattedPrice = datas.formattedPrice;
  const dayrent = datas.dayrent;

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='container'>
          <div className='cart-container'>
            <div className='row'>
              <div className='col-lg-8 product-content-left-big-img'>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className='d-flex align-items-center gap-5 mb-5'
                  >
                    <img
                      className='cart_img'
                      src={`http://localhost:5000/src/public/images/${item.productID.images}`}
                      alt={item.productID.name}
                    />
                    <h4 className='fw-bold m-0'>{item.productID.name}</h4>
                    <span className='cart_price'>{item.productID.price}</span>
                  </div>
                ))}
              </div>
              <div className='col-lg-4 product-content-left-small-img'>
                <div className='div2'>
                  <h1 className='text-center'>Summary</h1>
                  <form onSubmit={handleSubmit}>
                    <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                      <p className='m-0'>Quantity</p>
                      <span>{datas.cartItemCount}</span>
                    </div>
                    <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                      <p className='m-0 fw-bold'>Total</p>
                      <span className='cart_price'>{formattedPrice}</span>
                    </div>
                    <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                      <p className='m-0 fw-bold'>Total rental days</p>
                      <span className=''>{dayrent}</span>
                    </div>
                    <div className='form-group fw-bold'>
                      <label>Choose Payment Method:</label>
                      <div className='controls'>
                        <label className='radio-inline d-flex'>
                          <input
                            className='vnPayInput'
                            type='radio'
                            name='bankCode'
                            id='defaultPaymentMethod'
                            value=''
                          />
                          VNPAYQR Payment Gateway
                          <img
                            style={{ width: '24px' }}
                            src='https://play-lh.googleusercontent.com/o-_z132f10zwrco4NXk4sFqmGylqXBjfcwR8-wK0lO1Wk4gzRXi4IZJdhwVlEAtpyQ'
                            alt='VNPAYQR'
                          />
                        </label>
                        <label className='radio-inline'>
                          <input
                            className='visaInput'
                            type='radio'
                            name='visaCard'
                            id='defaultPaymentMethod'
                            value=''
                          />
                          Pay with Visa Card{' '}
                          <i className='fa-brands fa-cc-visa'></i>
                        </label>
                      </div>
                    </div>
                    <button type='submit' className='cart_order-btn text-white'>
                      Order Now!
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
