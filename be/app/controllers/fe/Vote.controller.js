const Vote = require( "../../models/Vote.model" );
const RoomController = require( "./Room.controller" );
// Phương thức `index`: Lấy danh sách đánh giá với phân trang
exports.index = async ( req, res ) =>
{
	  // Lấy giá trị `page` và `page_size` từ query params, mặc định `page` là 1 và `page_size` là 10
	const page = req.query.page || 1; // Nếu không có page thì mặc định là 1
	const page_size = req.query.page_size  || 10; // Nếu không có page_size thì mặc định là 10

	try
	{
		const condition = {};// Điều kiện tìm kiếm rỗng
		if ( req.query.user_id ) condition.user_id = req.query.user_id;// Nếu có user_id trong query thì thêm vào điều kiện tìm kiếm
		if ( req.query.room_id ) condition.room_id = req.query.room_id;// Nếu có room_id trong query thì thêm vào điều kiện tìm kiếm
		if ( req.query.vote_number ) condition.vote_number = req.query.vote_number;// Nếu có vote_number trong query thì thêm vào điều kiện tìm kiếm

		 // Tìm kiếm danh sách đánh giá với điều kiện, phân trang và populate các trường liên kết `user` và `room`
		const votes = await Vote.find()
			.where( condition )
			.limit( page_size )// Giới hạn số lượng đánh giá trả về theo page_size
			.skip( ( page - 1 ) * page_size )// Bỏ qua số lượng đánh giá đã được hiển thị trên các trang trước
			.populate( [ 'user', 'room' ] )// Populating các trường liên kết
			.exec();

		 // Đếm tổng số đánh giá theo điều kiện để tính tổng số trang
		const count = await Vote.count().where(condition);

		 // Chuẩn bị dữ liệu `meta` để phản hồi thông tin phân trang
		const meta = {
			total_page: Math.ceil( count / page_size ), // Tổng số trang
			total: count,// Tổng số đánh giá
			current_page: parseInt( page ),// Trang hiện tại
			page_size: parseInt( page_size )// Kích thước trang
		}
		const status = 200;
		const data = {
			votes: votes
		}
		res.json( {
			data,
			meta,
			status
		} );// Trả về phản hồi JSON với dữ liệu `votes`, `meta`, và `status`
	} catch ( err )
	{
		console.error( err.message );
	}
};
// Phương thức `show`: Lấy chi tiết một đánh giá theo `id`
exports.show = async ( req, res ) =>
{
	try
	{
		const vote = await Vote.findOne( { _id: req.params.id } ) // Tìm một đánh giá theo `_id` từ params
		return res.status( 200 ).json( { data: vote, status: 200 } );// Trả về phản hồi JSON nếu tìm thấy
	} catch {
		res.status( 404 )
		res.send( { error: "Vote doesn't exist!" } )
	}
};
// Phương thức `store`: Tạo mới một đánh giá
exports.store = async ( req, res ) =>
{
	try
	{
		let data = req.body;// Lấy dữ liệu đánh giá từ `body`
		const vote = new Vote( data ); // Tạo đối tượng Vote mới từ dữ liệu
		await vote.save();// Lưu đánh giá vào cơ sở dữ liệu
		 // Cập nhật điểm đánh giá cho phòng với phương thức `updateVoting` của `RoomController`
		await RoomController.updateVoting(data, 1);
		return res.status( 200 ).json( { data: vote, status: 200 } );
	} catch(e) {
		res.status( 200 )
		res.send( { status: 400, message: e.message || 'Reviews error' } )
	}
};
// Phương thức `update`: Cập nhật một đánh giá theo `id`
exports.update = async ( req, res ) =>
{
	try
	{
		const vote = await Vote.findOne( { _id: req.params.id } );// Tìm một đánh giá theo `_id` từ params

		if ( req.body.vote_content )// Cập nhật `vote_content` nếu có trong `body`
		{
			vote.vote_content = req.body.vote_content;
		}
		if ( req.body.vote_number )// Cập nhật `vote_number` nếu có trong `body`
		{
			vote.vote_number = req.body.vote_number;
		}
		

		await vote.save();
		await RoomController.updateVoting(vote, 0);// Cập nhật lại thông tin đánh giá của phòng
		return res.status( 200 ).json( { data: vote, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Review error!" } )
	}
};
// Phương thức `delete`: Xóa một đánh giá theo `id`
exports.delete = async ( req, res ) =>
{
	try
	{
		const vote = await Vote.findOne( { _id: req.params.id } ); // Tìm một đánh giá theo `_id` từ params
		await Vote.deleteOne( { _id: req.params.id } );// Xóa đánh giá
		await RoomController.updateVoting({room_id: vote.room_id, vote_number: vote.vote_number}, -1); // Cập nhật lại thông tin đánh giá của phòng sau khi xóa
		return res.status( 200 ).json( { data: [], status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Menu doesn't exist!" } )
	}
};
