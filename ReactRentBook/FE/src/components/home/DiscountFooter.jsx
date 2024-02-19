import React from 'react'
import './discountfooter.css'

const DiscountFooter = () => {
    return (
        <div>
            <section className='footerDiscount'>
                <div className='container-df'>
                    <div className='container-sale'>
                        <div className='text'>
                            <h1>Đọc nhiều nhất 2023</h1>
                            <div className='sale'>
                                <div>
                                    Giảm ngay 30%
                                </div>
                                <div>
                                    Trải nghiệm ngay
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-imgsale">
                        <img src='./images/saleimg.png' alt='' />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DiscountFooter
