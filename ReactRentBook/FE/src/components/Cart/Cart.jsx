import React, { useEffect, useState } from 'react';
import { Heading, Image, Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [datas, setDatas] = useState([]); // Initialize with an empty array
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState();
  const toast = useToast();
  const history = useHistory();

  const handleDeleteBtn = async (productId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/cart/deleteCartItem',
        { productId },
        { withCredentials: true },
      );
      if (res.status === 200) {
        toast({
          title: 'Delete Item Successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/cart/postCart',
        { date },
        { withCredentials: true },
      );
      if (res.status === 200) {
        history.push('/cart/payment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/cart/', {
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

  const cartItems = datas.cartItems || [];
  const totalPrice = datas.totalPrice ? formatPrice(datas.totalPrice) : '0 VND';

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='container'>
          <div className='cart-container'>
            <div className='row'>
              <div className='col-lg-8'>
                {cartItems.length === 0 ? (
                  <div className='d-flex flex-column align-items-center'>
                    <Image
                      w='70%'
                      src='https://assets.materialup.com/uploads/16e7d0ed-140b-4f86-9b7e-d9d1c04edb2b/preview.png'
                    />
                    <h2 className='text-body'>Giỏ hàng đang rỗng</h2>
                    <p className='text-secondary'>
                      Không tìm thấy sách nào trong giỏ hàng của bạn
                      Quay lại và thêm vào giỏ hàng nhé.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.productID._id}
                      className='d-flex align-items-center gap-6 mb-5'
                    >
                      <img
                        className='cart_img'
                        src={`http://localhost:5000/src/public/images/${item.productID.images}`}
                        alt='Product'
                      />
                      <div className='thongtin-sachthue d-flex flex-column'>
                      <h4 className='fw-bold m-0'>{item.productID.name}</h4>
                      <span className='cart_price'>
                        {formatPrice(item.productID.price)}
                      </span>
                      <button
                        onClick={() => handleDeleteBtn(item.productID._id)}
                        className='cart_delete-btn'
                      >
                        <i className='fas fa-trash-can'></i>
                      </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className='col-lg-4 product-content-left-small-img'>
                <div className='div2'>
                  <h1 className='text-center'>Giỏ hàng</h1>
                  <form onSubmit={handleSubmit}>
                    <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                      <p className='m-0'>Số ngày</p>
                      <span>{datas.cartItemCount}</span>
                    </div>
                    <div className='d-flex align-items-center justify-content-between product-content-left-big-img'>
                      <p className='m-0'>Tổng</p>
                      <span className='cart_price'>{datas.totalPrice}</span>
                    </div>
                    <div className='form-group fw-bold d-flex justify-content-between mt-1'>
                      <label htmlFor='date'>Chọn ngày thuê</label>
                      <div className='controls border'>
                        <input
                          className='datePicker'
                          type='date'
                          id='date'
                          name='date'
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <button type='submit' className='cart_order-btn text-white'>
                      Thuê ngay!
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

export default Cart;
