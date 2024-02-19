const Books = require('../model/Book');
const Author = require('../model/Author');
const Users = require('../model/User');
const Orders = require('../model/Order');
const Genres = require('../model/Genres');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
class siteController {
  async index(req, res, next) {
    try {
      const addtocartAPI = process.env.addtocartAPI;
      const sortPrice = req.query.sortPrice;
      const sortName = req.query.sortName;

      let sortCriteria = {};
      if (sortPrice === 'asc' || sortPrice === 'desc') {
        sortCriteria.price = sortPrice === 'asc' ? 1 : -1;
      }
      if (sortName === 'asc' || sortName === 'desc') {
        sortCriteria.name = sortName === 'asc' ? 1 : -1; // Assuming 'title' is the field name for book titles
      }

      const books = await Books.find()
        .populate('author')
        .sort(sortCriteria)
        .lean();
      const author = await Author.find().lean();
      res.json({ author, books, addtocartAPI });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async postBook(req, res, next) {
    try {
      // const imageFiles = req.files['images']; // Retrieve the array of image files
      // const imageUrl = imageFiles.map((file) => file.path); // Map the paths of image files
      const imageName = req.files['images'][0].filename;
      const pdfFile = req.files['pdfFile'][0].filename; // Retrieve the single PDF file
      // const pdfUrl = pdfFile.path; // Get the path of the uploaded PDF file
      const newBook = new Books({
        ...req.body,
        images: imageName,
        pdfFile: pdfFile,
      });
      const saveBook = await newBook.save();
      if (req.body.author) {
        const author = Author.findById(req.body.author);
        await author.updateOne({ $push: { books: saveBook._id } });
      }
      if (req.body.genres) {
        const genre = Genres.findById(req.body.genres);
        await genre.updateOne({ $push: { books: saveBook._id } });
      }
      res.status(200).json(saveBook);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async detailsBook(req, res, next) {
    try {
      const book = await Books.findOne({ slug: req.params.slug })
        .lean()
        .populate('author');
      const authorBook = await Books.find({ author: book.author._id }).lean();
      const genres = await Genres.findById(book.genres._id).lean();
      const addToCartAPI = process.env.addtocartAPI;
      res.status(200).json({
        book,
        authorBook,
        addToCartAPI,
        genres,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async deleteBook(req, res) {
    try {
      await Author.updateMany(
        { books: req.params.id },
        { $pull: { books: req.params.id } },
      );
      await Books.findByIdAndDelete(req.params.id);
      res.status(200).json('deleted successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async searchBook(req, res) {
    try {
      const query = req.query.q; // Retrieve the search query from the request URL query parameters

      if (!query || query.trim() === '') {
        return res.status(400).json({ message: 'Invalid search query' });
      }

      // Perform the search based on the query
      const books = await Books.find({
        $or: [
          { name: { $regex: query, $options: 'i' } }, // Case-insensitive title search
        ],
      })
        .populate('author')
        .lean();

      res.json({ books });
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async myBook(req, res) {
    try {
      const token = req.headers.access_token; // Ensure token is defined

      // Verify the token asynchronously
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, user) => {
        if (err) {
          console.log(err);
          return res.status(403).json('Token is not valid');
        }

        // Once the token is verified, proceed with the rest of the function
        try {
          const foundUser = await Users.findById(user.id);
          const orders = await Orders.find({ 'user.userID': foundUser._id });

          // Constructing an array of products with their timerent
          const productsWithTimerent = orders.flatMap((order) =>
            order.products.map((product) => ({
              ...product.productData,
              timerent: product.timerent,
            })),
          );

          console.log(productsWithTimerent);
          return res.status(200).json({ productsWithTimerent });
        } catch (innerErr) {
          // Handle any errors that occur while fetching user or orders
          console.error(innerErr);
          return res.status(500).json('Internal Server Error');
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal Server Error');
    }
  }

  async postLinkBook(req, res) {
    try {
      const productId = req.body.productID;
      const user = await Users.findById(req.user.id);
      const order = await Orders.findOne({ 'user.userID': user._id });
      if (!user) {
        return res.status(403).json('Not find User');
      }
      const secret = process.env.JWT_ACCESS_TOKEN + user.password;
      const token = jwt.sign({ id: user._id, productId }, secret, {
        expiresIn: '5m',
      });
      const url = `http://localhost:5000/readbook/${user._id}/${token}`;
      console.log(url);
      return res.status(200).json(url);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  //* Sau khi thanh toán xong, trang My Book sẽ lấy từ order(ktra req.user, get id from Order)
  //* Truyền productID vào các sách trong MyBook
  //*Đọc sách sẽ lấy từ id của mybook xuất ra file pdf đó

  readMyBook(req, res) {
    //* sẽ lấy id của sách(req.body._id), sau đó lấy pdf file từ sách đó,
    const { id, token } = req.params;
    const { productId } = jwt.decode(token);
    Users.findOne({ _id: id }).then((user) => {
      if (!user) {
        return res.json('User not found');
      }
      const secret = process.env.JWT_ACCESS_TOKEN + user.password;
      try {
        const verify = jwt.verify(token, secret);
        Orders.find({ 'user.userID': user._id }).then((product) => {
          const productDataArray = product.flatMap((order) =>
            order.products.map((product) => product.productData),
          );
          let specificBook = null;
          for (const book of productDataArray) {
            const bookID = String(book._id);
            if (bookID === productId) {
              specificBook = book;
              break;
            } else {
              console.log(book._id);
            }
          }
          if (specificBook) {
            console.log(specificBook);
            res.render('my-book', {
              specificBook,
            });
          }
        });
      } catch (err) {
        res.send('not verified');
      }
    });
  }

  async getChart(req, res) {
    try {
      const result = await Orders.aggregate([
        {
          $unwind: '$products',
        },
        {
          $group: {
            _id: '$products.productData',
            count: { $sum: 1 },
          },
        },
      ]);
      const labels = result.map((item) => item._id.name);
      const counts = result.map((item) => item.count);

      // Prepare the response
      const response = {
        labels: labels,
        counts: counts,
      };
      res.render('chartOrder', {
        response,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: 'An error occurred' });
    }
  }
}

module.exports = new siteController();
