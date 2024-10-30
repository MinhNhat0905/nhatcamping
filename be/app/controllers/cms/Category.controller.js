const { buildParamPaging, buildResponsePaging } = require( "../../helpers/buildData.helper" );
const Category = require( "../../models/Category.model" );

exports.index = async ( req, res ) =>
{
	// destructure page and limit and set default values

	try
	{
		const condition = {};
		const paging = buildParamPaging( req.query );// Gọi hàm buildParamPaging để lấy thông tin phân trang từ query.
		// Truy vấn các danh mục với phân trang.
		const categories = await Category.find()
			.where( condition )
			.limit( paging.page_size )
			.skip( ( paging.page - 1 ) * paging.page_size )
			.exec();

		// get total documents in the Posts collection
		const count = await Category.count().where(condition);

		// return response with posts, total pages, and current page
		const meta = buildResponsePaging( paging.page, paging.page_size, count )// Gọi hàm buildResponsePaging để tạo metadata cho phản hồi.
		const status = 200;
		const data = {
			categories: categories
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
		const category = await Category.findOne( { _id: req.params.id } )// Tìm danh mục theo ID.
		return res.status( 200 ).json( { data: category, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Category doesn't exist!" } )
	}
};

exports.store = async ( req, res ) =>
{
	let data = req.body;
	const category = new Category( data );
	await category.save();
	return res.status( 200 ).json( { data: category, status: 200 } );
};

exports.update = async ( req, res ) =>
{
	try
	{
		const category = await Category.findOne( { _id: req.params.id } )// Tìm danh mục theo ID.

		if ( req.body.name )
		{
			category.name = req.body.name;// Cập nhật tên của danh mục nếu có trong request.
		}

		await category.save();
		return res.status( 200 ).json( { data: category, status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Category doesn't exist!" } )
	}
};

exports.delete = async ( req, res ) =>
{
	try
	{
		await Category.deleteOne( { _id: req.params.id } )// Xóa danh mục theo ID
		return res.status( 200 ).json( { data: [], status: 200 } );
	} catch {
		res.status( 404 )
		res.send( { error: "Menu doesn't exist!" } )
	}
};
