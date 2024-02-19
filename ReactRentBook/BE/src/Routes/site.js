const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'images') {
      cb(null, 'src/public/images');
    } else if (file.fieldname === 'pdfFile') {
      cb(null, 'src/public/PDF');
    } else {
      cb(new Error('Invalid fieldname'));
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname,
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpg', 'image/png', 'image/jpeg'];
  const allowedPDFTypes = ['application/pdf'];

  if (
    file.fieldname === 'images' &&
    allowedImageTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else if (
    file.fieldname === 'pdfFile' &&
    allowedPDFTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
const siteController = require('../app/controllers/siteController');
const verifyController = require('../app/middlewares/verifyController');
router.get('/', siteController.index);
// router.get(
//   '/createForm',
//   // verifyController.verifyToken,
//   // verifyController.verifyAdmin,
//   siteController.createFormBook,
// );
router.post(
  '/postbook',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'pdfFile', maxCount: 1 },
  ]),
  siteController.postBook,
);
router.get('/details/:slug', siteController.detailsBook);
router.delete('/:id', siteController.deleteBook);
router.get('/search', siteController.searchBook);
router.get('/mybook', siteController.myBook);
router.post(
  '/postLinkBook',
  verifyController.verifyToken,
  siteController.postLinkBook,
); //* sau khi thanh toán sẽ đc post qua route này
router.get(
  '/readbook/:id/:token',
  verifyController.verifyToken,
  siteController.readMyBook,
);

//*chart
router.get('/chart', siteController.getChart);
module.exports = router;
