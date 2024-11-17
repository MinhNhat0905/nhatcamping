const User = require("./../../models/User.model") // new
const bcrypt = require("bcryptjs");
const Role = require("../../models/Role.model");
const Permission = require("../../models/Permission.model"); // new

exports.index = async (req, res) => {
    
    const page = req.query.page || 1; 
    const page_size = req.query.page_size  || 10;

    try {
        const condition = {};
        condition.type = 'USER';
       
        const users = await User.find()
            .where(condition)
            .limit(page_size)
            .skip((page - 1) * page_size)
            .populate(['roles'])
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
        const user = await User.findOne({ _id: req.params.id })// Tìm người dùng theo ID
        return res.status(200).json({ data: user, status : 200 });
    } catch {
        res.status(404)
        res.send({ error: "Article doesn't exist!" })
    }
};
