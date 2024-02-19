import {
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './details.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import StarRating from '../StarsRating/StarsRating';
const Details = () => {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    // Update slidesPerView based on screen width
    const updateSlidesPerView = () => {
      if (window.innerWidth <= 800) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(3);
      }
    };

    // Initially set slidesPerView
    updateSlidesPerView();

    // Add a resize event listener to adjust slidesPerView on window resize
    window.addEventListener('resize', updateSlidesPerView);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
    };
  }, []);
  const { slug } = useParams(); // 'slug' is the name of the parameter you set in your route
  const [datas, setDatas] = useState([]);
  // const [genres, setGenres] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState('');
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      const api = `http://localhost:5000/details/${slug}`;

      try {
        setIsLoading(true);
        const response = await axios.get(api);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setDatas(response.data);
      } catch (error) {
        console.error('API request error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array for one-time execution
  const books = datas.book;
  const authorBook = datas.authorBook;

  // setGenres(datas.genres.name);
  const genres = datas.genres;
  // const genresName = genres.name;
  const addToCartSubmit = async (id) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/cart/addcart',
        {
          productID: id,
        },
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Add Item to your Cart Successfully',
          description: 'You have successfully added your item to your cart',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const formatPriceVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='container mt-5'>
          <Grid templateColumns='repeat(2, 1fr)' gap={10}>
            <div className='tt-detail'>
              <GridItem>
                <div className='img-detail'>
                  <div className='detail-image_container p-3'>
                    <Image
                      className='w-100'
                      src={
                        'http://localhost:5000/src/public/images/' +
                        books.images
                      }
                    />
                  </div>
                </div>
              </GridItem>
              <div className='ttsach-detail'>
                <GridItem>
                  <div className='detail-image_container p-3'>
                    <Center>
                      <Heading p={10}>{books.name}</Heading>
                    </Center>
                    <div className='detail_content d-flex align-items-center'>
                      <div className='d-flex align-items-center author-container'>
                        <p className='m-0 text-secondary-emphasis'>Tác giả:</p>{' '}
                        <p className='m-0 fw-bold'>{books.author.name}</p>
                      </div>
                      <StarRating
                        onSetRating={setUserRating}
                        maxRating={5}
                        size={34}
                      ></StarRating>
                    </div>
                    <Divider />
                    <div className='p-3 mb-5'>
                      <h1 className='detail_content-pirce'>
                        {books && books.price
                          ? formatPriceVND(books.price)
                          : ''}
                      </h1>
                      <div className='d-flex align-items-center gap-3'>
                        <div
                          class='btn w-100 detail-content_btn btn-outline-danger'
                          onClick={() => addToCartSubmit(books._id)}
                        >
                          <i class='fa-solid fa-cart-shopping'></i>
                          Thêm vào giỏ hàng
                        </div>
                        <div class='btn w-100 detail-content_btn btn-danger fw-bold'>
                          Thuê ngay
                        </div>
                      </div>
                    </div>
                    <Divider />
                    <div className='d-flex align-items-center'>
                      <p className='detail-content_cate m-0 p-2'>Thể loại:</p>
                      <p className=' text-black fw-bold m-0 p-2'>
                        {genres == undefined ? <Spinner /> : genres.name}
                      </p>
                    </div>
                  </div>
                </GridItem>
              </div>
            </div>
          </Grid>
          <div className='tab-container mt-5'>
            <Tabs isFitted>
              <TabList color='grey' align='center'>
                <Tab _selected={{ color: 'black' }}>Mô tả</Tab>
                <Tab _selected={{ color: 'black' }}>Đánh giá</Tab>
                <Tab _selected={{ color: 'black' }}>Thông tin</Tab>
              </TabList>
              <TabIndicator
                mt='-1.5px'
                height='2px'
                bg='red'
                borderRadius='1px'
              />
              <TabPanels>
                <TabPanel>
                  <div className='Tab-pannel border p-3'>
                    <p className='fs-5'>{books.description}</p>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='Tab-pannel border p-3'></div>
                </TabPanel>
                <TabPanel>
                  <div className='Tab-pannel border p-3'>
                    <Table>
                      <Tr>
                        <Th className='table-header'>Mã hàng:</Th>
                        <Td>{books._id}</Td>
                      </Tr>
                      <Tr>
                        <Th className='table-header'>Tên tác giả:</Th>
                        <Td>{books.author.name}</Td>
                      </Tr>
                    </Table>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        <div className="lq-detail">
          <div className='related-product_container mt-4'>
            <Heading>Sản phẩm liên quan</Heading>
            <Swiper  slidesPerView={slidesPerView} spaceBetween={30}>
              {authorBook.map((book, key) => (
                <SwiperSlide key={key}>
                  <a href={`/details/${book.slug}`} className=''>
                    <Image
                      borderRadius={30}
                      src={
                        'http://localhost:5000/src/public/images/' + book.images
                      }
                    />
                    <div className='lq-book-name'>{book.name}</div>
                    <div className='detail-content_cate'>
                      {books.author.name}
                    </div>
                    <p className='detail_content-pirce'>
                      {book.price ? formatPriceVND(book.price) : ''}
                    </p>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* <div className='row'>
              <div className='col-lg-4'></div>
            </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Details;
