import React from 'react';
import './CustomerCard.css';
import CH from '../../../assets/public/images/CongHuy.png';
import QM from '../../../assets/public/images/QuangMInh.png';
import DT from '../../../assets/public/images/Tam.png';

export function CustomerCard() {
  const customerInfo = [
    {
      imgPath: CH,
      comment:
        'Đây là cửa hàng sách tốt nhất! Giá cả rất tốt và luôn có một đợt giảm giá nào đó đang diễn ra.',
      name: 'Công Huy / Hồ Chí Minh',
    },
    {
      imgPath: QM,
      comment:
        'Tôi rất vui khi tìm được một trang web nơi tôi có thể mua sắm những món đồ đặc biệt.',
      name: 'Quang Minh / Hồ Chí Minh',
    },
    {
      imgPath: DT,
      comment:
        'Đây là một website có dịch vụ thuê sách rất tốt, giá cả hợp lý !',
      name: 'Đoàn Tâm / Hồ Chí Minh',
    },
  ];
  return (
    <>
      <div className='container mt-5 mb-5'>
        <h1 className='mb-3'>Đánh giá của đọc giả</h1>
        <div className='customer-card_container'>
          <div className='row'>
            {customerInfo.map((customer) => (
              <>
                <div className='col-lg-4'>
                  <div className='d-flex flex-column align-items-center customer-card p-3'>
                    <img
                      className='customer-card_img'
                      src={customer.imgPath}
                      alt=''
                    />
                    <span className='mb-1 fw-bold'>{customer.comment}</span>
                    <p className='customer-card_name'>{customer.name}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
