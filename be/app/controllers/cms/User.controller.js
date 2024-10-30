const User = require("./../../models/User.model") // new

exports.index = async (req, res) => {
    
    const page = req.query.page || 1; const page_size = req.query.page_size  || 10;

    try {
        const condition = {};
        condition.type = 'USER';
       
        const users = await User.find()
            .where(condition)
            .limit(page_size)
            .skip((page - 1) * page_size)
            .exec();

       
        const count = await User.count();

         // Trả về phản hồi với danh sách người dùng, tổng số trang, và trang hiện tại
        const meta = {
            total_page: Math.ceil(count / page_size),
            total: count,
            current_page: parseInt(page),
            page_size: parseInt(page_size)
        }
        const status =  200;
        const data = {
            users: users
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
         // Tìm người dùng theo ID
        const user = await User.findOne({ _id: req.params.id })
        return res.status(200).json({ data: user, status : 200 });
    } catch {
        res.status(404)
        res.send({ error: "Article doesn't exist!" })
    }
};

exports.store = async (req, res) => {
     // Tạo một người dùng mới
    const user = new User({
        name: req.body.name,
        avatar: req.body.avatar || null,
        email: req.body.email,
        birthday: req.body.birthday,
        sex: req.body.sex,
        status: req.body.status || 1,

    })
    await user.save();
    return res.status(200).json({ data: user, status : 200 });
};

exports.update = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
 // Cập nhật thông tin người dùng nếu có
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.avatar) {
            user.avatar = req.body.avatar;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.sex) {
            user.sex = req.body.sex;
        }
        if (req.body.birthday) {
            user.birthday = req.body.birthday;
        }

        await user.save();
        return res.status(200).json({ data: user, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "User doesn't exist!" })
    }
};

exports.delete = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id })
        return res.status(200).json({ data: [], status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "User doesn't exist!" })
    }
};
