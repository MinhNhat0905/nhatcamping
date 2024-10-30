const Article = require("./../../models/Article.model") // new

exports.index = async (req, res) => {
    // destructure page and limit and set default values
    const page = req.query.page || 1; 
	const page_size = req.query.page_size  || 10;

    try {
        // execute query with page and limit values
        const articles = await Article.find()
            .limit(page_size)// Giới hạn số lượng bài viết theo kích thước trang.
            .skip((page - 1) * page_size)// Bỏ qua bài viết dựa trên trang hiện tại.
            .populate(['menu'])// Kết hợp dữ liệu của trường 'menu' từ bảng Menu.
            .exec();

        // get total documents in the Posts collection
        const count = await Article.count();

        // return response with posts, total pages, and current page
        const meta = {
            total_page: Math.ceil(count / page_size),
            total: count,
            current_page: parseInt(page),
            page_size: parseInt(page_size)
        }
        const status =  200;
        const data = {
            articles: articles
        }
        res.json({
            data,
            meta,
            status
        });
    } catch (err) {
        console.error(err.message);
    }
};

exports.show = async (req, res) => {
    try {
        const article = await Article.findOne({ _id: req.params.id })// Tìm bài viết theo ID.
        return res.status(200).json({ data: article, status : 200 });
    } catch {
        res.status(404)
        res.send({ error: "Article doesn't exist!" })
    }
};

exports.store = async (req, res) => {
    const article = new Article({// Tạo đối tượng bài viết mới với thông tin từ request.
        name: req.body.name,
        avatar: req.body.avatar || null,
        description: req.body.description,
        article_content: req.body.article_content,
        menu_id : req.body.menu_id
    })
    await article.save();
    return res.status(200).json({ data: article, status : 200 });
};

exports.update = async (req, res) => {
    try {
        const article = await Article.findOne({ _id: req.params.id })// Tìm bài viết theo ID.

        if (req.body.name) {// Cập nhật tên bài viết nếu có.
            article.name = req.body.name;
        }
        if (req.body.avatar) {// Cập nhật ảnh đại diện nếu có.
            article.avatar = req.body.avatar;
        }
        if (req.body.description) {// Cập nhật mô tả nếu có.
            article.description = req.body.description;
        }
        if (req.body.menu_id) {// Cập nhật menu_id nếu có.
            article.menu_id = req.body.menu_id;
        }
        if (req.body.article_content) {// Cập nhật nội dung bài viết nếu có.
            article.article_content = req.body.article_content;
        }

        await article.save();
        return res.status(200).json({ data: article, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Article doesn't exist!" })
    }
};

exports.delete = async (req, res) => {
    try {
        await Article.deleteOne({ _id: req.params.id })
        return res.status(200).json({ data: [], status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Article doesn't exist!" })
    }
};
