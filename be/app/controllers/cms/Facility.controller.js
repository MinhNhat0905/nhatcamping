const { buildParamPaging, buildResponsePaging } = require( "../../helpers/buildData.helper" );
const Facility = require( "../../models/Facility.model" );

exports.index = async ( req, res ) =>
{
	try
	{
		const condition = {};// Có thể thêm điều kiện tìm kiếm nếu cần
		const paging = buildParamPaging( req.query );// Gọi hàm buildParamPaging để lấy thông tin phân trang từ query.
		// Truy vấn các danh mục với phân trang.
		const facilities = await Facility.find()
			.where( condition )
			.limit( paging.page_size )
			.skip( ( paging.page - 1 ) * paging.page_size )
			.exec();

		// Lấy tổng số tài liệu trong collection
		const count = await Facility.count().where(condition);

		 // Trả về phản hồi với danh sách tiện nghi, tổng số trang, và trang hiện tại
		const meta = buildResponsePaging( paging.page, paging.page_size, count )//tạo metadata cho phản hồi.
		const status = 200;
		const data = {
			facilities: facilities,
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

exports.show = async ( req, res ) =>
{
	try
	{
		const facility = await Facility.findOne( { _id: req.params.id } )// Tìm tiện nghi theo ID.
		return res.status( 200 ).json( { data: facility, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Facility doesn't exist!" } )
	}
};

exports.store = async ( req, res ) =>
{
	let data = req.body;// Dữ liệu từ request body
	const facility = new Facility( data );
	await facility.save();
	return res.status( 200 ).json( { data: facility, status: 200 } );
};

exports.update = async ( req, res ) =>
{
	try
	{
		const facility = await Facility.findOne( { _id: req.params.id } )// Tìm tiện nghi theo ID.
		if (!facility) {
			return res.status(404).json({ error: "Facility doesn't exist!" });
		  }
		if ( req.body.name )
		{
			facility.name = req.body.name;// Cập nhật tên của danh mục nếu có trong request.
		}

		await facility.save();
		return res.status( 200 ).json( { data: facility, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Facility doesn't exist!" } )
	}
};

exports.delete = async ( req, res ) =>
{
	try
	{
		await Facility.deleteOne( { _id: req.params.id } )// Xóa danh mục theo ID
		return res.status( 200 ).json( { data: [], status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Menu doesn't exist!" } )
	}
};
