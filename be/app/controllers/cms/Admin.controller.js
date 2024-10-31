const User = require("./../../models/User.model")
const bcrypt = require("bcryptjs");
const Role = require("../../models/Role.model");
const Permission = require("../../models/Permission.model"); // new

exports.index = async (req, res) => {
    // destructure page and limit and set default values
    const page = req.query.page || 1; 
	const page_size = req.query.page_size  || 10;

    try {
        const condition = {};
        condition.type = 'ADMIN'; // Chỉ lấy người dùng có type là 'ADMIN'.
        // execute query with page and limit values
        const users = await User.find()// Thực hiện truy vấn tìm kiếm người dùng.
            .where(condition)//điều kiện lọc.
            .limit(page_size)// Giới hạn số bản ghi lấy ra theo kích thước trang
            .skip((page - 1) * page_size)// Bỏ qua số bản ghi dựa trên trang hiện tại.
            .populate(['roles'])// Kết hợp dữ liệu của các trường roles từ bảng Role.
            .exec();// Thực thi truy vấn.

        // get total documents in the Posts collection
        const count = await User.count(); // Đếm tổng số admin trong bảng User.

        // return response with posts, total pages, and current page
        const meta = {
            total_page: Math.ceil(count / page_size),// Tính tổng số trang.
            total: count,// Tổng số bản ghi.
            current_page: parseInt(page),// Trang hiện tại.
            page_size: parseInt(page_size)// Kích thước trang.
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
        const user = await User.findOne({ _id: req.params.id })// Tìm admin theo ID.
        return res.status(200).json({ data: user, status : 200 });
    } catch {
        res.status(404)
        res.send({ error: "Article doesn't exist!" })
    }
};

exports.store = async (req, res) => {
    // Tạo một admin mới
    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    const user = new User({
        name: req.body.name,
        avatar: req.body.avatar || null,
        password: hashPassword,
        email: req.body.email,
        birthday: req.body.birthday,
        sex: req.body.sex,
        status: req.body.status || 1,
        type: "ADMIN",
        roles: req.body.roles || []
    })
    await user.save();
    await Role.updateMany({ '_id': user.roles }, { $push: { admins: user._id } });// Cập nhật Role để thêm admin vào roles tương ứng.
    return res.status(200).json({ data: user, status : 200 });
};

exports.update = async (req, res) => {
    try {
        const _id = req.params.id; // Lấy ID admin từ request.
        const user = req.body; // Lấy thông tin cập nhật từ request.

        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 12);
        }

        // permission <-> role
        const newRoles = user.roles || [];// Lấy danh sách roles mới từ request.
        console.log('------------- new ROLE: ', newRoles);
        const oldUser = await User.findOne({ _id });// Tìm admin hiện tại.
        const oldRoles = oldUser.roles;// Lấy danh sách roles hiện tại của admin.

        Object.assign(oldUser, user);// Cập nhật thông tin admin.
        const newUser = await oldUser.save();// Lưu thông tin đã cập nhật.

        const added = difference(newRoles, oldRoles);// Tính các roles cần thêm vào.
        const removed = difference(oldRoles, newRoles);// Tính các roles cần loại bỏ.

        await Role.updateMany({ '_id': added }, { $addToSet: { admins: _id } });// Cập nhật Role thêm admin vào roles cần thêm.
        await Role.updateMany({ '_id': removed }, { $pull: { admins: _id } });// Cập nhật Role để xóa admin khỏi roles cần loại bỏ.

        return res.status(200).json({ data: newUser, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "User doesn't exist!" })
    }
};

exports.delete = async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id })// Xóa admin theo ID.
        return res.status(200).json({ data: [], status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "User doesn't exist!" })
    }
};


function difference(A, B) {
    const arrA = Array.isArray(A) ? A.map(x => x.toString()) : [A.toString()];
    const arrB = Array.isArray(B) ? B.map(x => x.toString()) : [B.toString()];

    const result = [];
    for (const p of arrA) {
        if (arrB.indexOf(p) === -1) {
            result.push(p);
        }
    }

    return result;
}
