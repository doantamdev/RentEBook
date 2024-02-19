const Authors = require('../model/Author');
class authorController {
    async postAuthor(req,res,next) {
        try {
            const newauthor = new Authors(req.body);
            const savedauthor = await newauthor.save();
            res.status(200).json(savedauthor);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = new authorController();