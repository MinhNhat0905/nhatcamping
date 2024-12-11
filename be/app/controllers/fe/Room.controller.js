const { buildResponsePaging, buildParamPaging } = require( "../../helpers/buildData.helper" );
const Room = require( "./../../models/Room.model" )
const mongoose = require('mongoose');

// Phương thức `index`: Lấy danh sách phòng với phân trang
exports.index = async ( req, res ) =>
{


	try
	{
		// Tạo đối tượng điều kiện để tìm kiếm
		const condition = {};
		if(req.query.size) condition.size = req.query.size; // Lọc theo kích thước phòng nếu có
		if(req.query.bed) condition.bed = req.query.bed;// Lọc theo số giường nếu có
		if(req.query.name) condition.name = {$regex : '.*'+ req.query.name + '.*'};// Lọc theo tên phòng nếu có (sử dụng regex để tìm kiếm phần nào của tên)
		 // Lọc theo giá
        if (req.query.price) {
            const priceRange = req.query.price;

            if (priceRange === 'under300000') {
                // Tìm phòng có giá dưới 300000
                condition.price = { $lt: 300000 };
            } else if (priceRange === '300000-500000') {
                // Tìm phòng có giá trong khoảng từ 300000 đến 500000
                condition.price = { $gte: 300000, $lte: 500000 };
            } else if (priceRange === '500000-700000') {
                // Tìm phòng có giá trong khoảng từ 500000 đến 700000
                condition.price = { $gte: 500000, $lte: 700000 };
            } else if (priceRange === 'above700000') {
                // Tìm phòng có giá trên 700000
                condition.price = { $gt: 700000 };
            }
        }
		if(req.query.floors) condition.floors = req.query.floors;// Lọc theo số tầng nếu có
		if(req.query.quantity) condition.quantity = req.query.quantity;
		if(req.query.address) condition.address = req.query.address;// 
		if(req.query.category_id) condition.category_id = req.query.category_id;// Lọc theo ID danh mục nếu có
		if (req.query.facilities) {
            const facilities = req.query.facilities.split(",");
            console.log("Facilities filter:", facilities);  // Log tiện nghi được truyền vào
            const validFacilities = facilities.filter(facility => mongoose.Types.ObjectId.isValid(facility));

            if (validFacilities.length > 0) {
                condition.facilities = { $in: validFacilities.map(facility => new mongoose.Types.ObjectId(facility)) };
            } else {
                return res.status(400).json({ error: "Invalid facility IDs provided." });
            }
        }
		// if(req.query.size) condition.size = req.query.size;
		const paging = buildParamPaging( req.query );// Xây dựng tham số phân trang từ query
		const rooms = await Room.find()// Tìm kiếm các phòng với điều kiện đã xác định
		
			.where( condition )
			.limit( paging.page_size )// Giới hạn số lượng phòng trả về theo kích thước trang
			.skip( ( paging.page - 1 ) * paging.page_size )// Bỏ qua số lượng phòng theo trang hiện tại
			.exec();

		// Đếm số lượng phòng theo điều kiện
		//const count = await Room.count().where(condition);
		const count = await Room.countDocuments(condition); // Đếm số lượng phòng
		// Chuẩn bị phản hồi với danh sách phòng, tổng số trang và trang hiện tại
		const meta = buildResponsePaging( paging.page, paging.page_size, count )
		const status = 200;
		const data = {
			rooms: rooms
		}
		res.json( {
			data,
			meta,
			status
		} );
	} catch ( err )
	{
		console.error( err.message );
	}
};
// Phương thức `show`: Lấy chi tiết một phòng theo `id`
exports.show = async ( req, res ) =>
{
	try
	{
		const room = await Room.findOne( { _id: req.params.id } )
		return res.status( 200 ).json( { data: room, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Room doesn't exist!" } )
	}
};
// Phương thức `updateVoting`: Cập nhật thông tin đánh giá của phòng
exports.updateVoting = async ( data, number ) =>
{
	try
	{
		const room = await Room.findOne( { _id: data.room_id } ); // Tìm phòng theo `room_id`
		if ( room )
		{
			// Cập nhật tổng số đánh giá và tổng sao
			room.total_vote = room.total_vote ? Number( room.total_vote ) + number : number;
			room.total_star = room.total_star ? Number( room.total_star ) + Number( data.vote_number ) : Number( data.vote_number );
			await room.save();
		}
	} catch ( e )
	{
		throw e;
	}
};
