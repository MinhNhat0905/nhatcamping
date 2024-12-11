const { buildResponsePaging, buildParamPaging } = require( "../../helpers/buildData.helper" );
const Room = require("./../../models/Room.model")
const Category = require("./../../models/Category.model")
const Facility = require("./../../models/Facility.model");

exports.index = async (req, res) => {

    try {
        // execute query with page and limit values
		let condition = {}
		if(req.query.size) condition.size = req.query.size; 
		if(req.query.bed) condition.bed = req.query.bed;
		if(req.query.name) condition.name = {$regex : '.*'+ req.query.name + '.*'};
		if(req.query.price) condition.price = req.query.price;
		if(req.query.floors) condition.floors = req.query.floors;
        if(req.query.address) condition.address = req.query.address;
        if(req.query.quantity) condition.quantity = req.query.quantity;
		if(req.query.category_id) condition.category_id = req.query.category_id;
        if(req.query.facility_id) condition.facility_id = req.query.facility_id;

		const paging = buildParamPaging( req.query );
		const rooms = await Room.find()// Truy vấn phòng với các điều kiện và phân trang
		.where( condition )
		.limit( paging.page_size )
		.skip( ( paging.page - 1 ) * paging.page_size )
        .populate({ path: 'category', select: 'name' }) // Lấy tên của category
        .populate({ path: 'facilities', select: 'name' }) // Lấy tên của facility
		.exec();


	    // Lấy tổng số phòng theo điều kiện
	    const count = await Room.count().where(condition);

        // return response with posts, total pages, and current page
        const meta = buildResponsePaging( paging.page, paging.page_size, count )
        const status =  200;
        const data = {
            rooms: rooms
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
// Lấy thông tin chi tiết của một phòng
exports.show = async (req, res) => {
    try {
        const room = await Room.findOne({ _id: req.params.id })
        return res.status(200).json({ data: room, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Room doesn't exist!" })
    }
};
// Tạo mới một phòng
exports.store = async (req, res) => {
    const category = await Category.findById(req.body.category_id);
    const facilities = await Facility.find({ '_id': { $in: req.body.facilities} }); // Lấy tiện nghi liên quan đến phòng từ mảng ID.
    const location = req.body.location;
    
    if (!location || !location.lat || !location.lng) {
        return res.status(400).json({ error: "Location with lat and lng is required" });
    }
    const room = new Room({
        name: req.body.name,
        avatar: req.body.avatar || null,
        description: req.body.description,
        room_content: req.body.room_content,
        price: req.body.price,
        size: req.body.size,
        bed: req.body.bed,
		albums: req.body.albums,
        room_code: req.body.room_code,
        floors: req.body.floors,
        address: req.body.address,
        quantity: req.body.quantity,
        category: category,
        category_id: req.body.category_id,
        facilities: facilities, 
        facility_id: req.body.facility_id,
        location: {
            type: 'Point', // GeoJSON type
            coordinates: [location.lng, location.lat] // Tọa độ theo dạng [longitude, latitude]
        }
    })
    await room.save()
    return res.status(200).json({ data: room, status : 200 });
};
// Cập nhật thông tin một phòng
exports.update = async (req, res) => {
    try {
        const room = await Room.findOne({ _id: req.params.id })
        const category = await Category.findById(req.body.category_id);
        const facilities = await Facility.find({ '_id': { $in: req.body.facilities} });  // Cập nhật tiện nghi cho phòng.
        if (req.body.name) {
            room.name = req.body.name;
        }
        if (req.body.avatar) {
            room.avatar = req.body.avatar;
        }
		if (req.body.albums) {
            room.albums = req.body.albums;
        }
        if (req.body.description) {
            room.description = req.body.description;
        }
        if (req.body.room_content) {
            room.room_content = req.body.room_content;
        }

        if (req.body.price) {
            room.price = req.body.price;
        }

        if (req.body.category_id) {
            room.category_id = req.body.category_id;
            room.category = category;
        }
        // Cập nhật tiện nghi
        if (req.body.facilities) {
            room.facilities = facilities;  // Cập nhật tiện nghi cho phòng.
        }


        if (req.body.size) {
            room.size = req.body.size;
        }

        if (req.body.bed) {
            room.bed = req.body.bed;
        }

        if (req.body.room_code) {
            room.room_code = req.body.room_code;
        }

        if (req.body.floors) {
            room.floors = req.body.floors;
        }
        if (req.body.address) {
            room.address = req.body.address;
        }
        if (req.body.quantity) {
            room.quantity = req.body.quantity;
        }
         // Cập nhật thông tin vị trí (nếu có)
         if (req.body.location && req.body.location.coordinates) {
            // Đảm bảo bạn truyền vào là mảng [longitude, latitude]
            room.location = {
                type: 'Point',
                coordinates: req.body.location.coordinates
            };
        }

        await room.save();
        return res.status(200).json({ data: room, status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Room doesn't exist!" })
    }
};
// Xóa một phòng
exports.delete = async (req, res) => {
    try {
        await Room.deleteOne({ _id: req.params.id })
        return res.status(200).json({ data: [], status: 200 });
    } catch {
        res.status(404)
        res.send({ error: "Room doesn't exist!" })
    }
};
