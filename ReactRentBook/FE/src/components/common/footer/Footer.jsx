import React from 'react'
import "./footer.css"

const Footer = () => {
    return (
        <>
            <footer class="footer">
                <div class="container-ft container">
                    <div class="row">
                        <div class="col-lg-3">
                            <h4>Thuê sách điện tử</h4>
                            <div >
                                828 Sư Vạn Hạnh phường 12 Quận 10 Tp.HCM
                            </div>
                            <img src='./images/logo.png' alt='' />
                        </div>
                        <div class="col-lg-3">
                            <h4>Tư vấn liên hệ</h4>
                            <div class="lienhe-ft">
                                <b>+(84) 123 456 7890</b>
                            </div>
                            <div className='lich'>
                                Thứ 2 – Thứ 6: 9:00-20:00
                                Thứ 7: 11:00 – 15:00
                            </div>
                            <div>
                                rentbookcontact@st.huflit.edu.vn
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <h4>Về chúng tôi</h4>
                            <div>
                                Trần Quang Minh - Chủ tịch
                            </div>
                            <div>
                                Huỳnh Đoàn Tâm - Phó chủ tịch
                            </div>
                            <div>
                                Trịnh Nguyễn Hoàng Thọ - Giám đốc
                            </div>
                            <div>
                                Võ Minh Hiếu - Tưởng phòng
                            </div>
                            <div>
                                Trương Công Huy - Phó trưởng phòng
                            </div>
                            
                        </div>
                        <div class="col-lg-3">
                            <h4>Theo dõi chúng tôi</h4>
                            <div class="contact-ft">
                            <i class="fa-brands fa-facebook"></i>
                            <i class="fa-brands fa-linkedin"></i>
                            <i class="fa-brands fa-telegram"></i>
                            <i class="fa-brands fa-twitter"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
