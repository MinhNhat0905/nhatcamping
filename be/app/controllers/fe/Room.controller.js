const { buildResponsePaging, buildParamPaging } = require( "../../helpers/buildData.helper" );
const Room = require( "./../../models/Room.model" )

exports.index = async ( req, res ) =>
{


	try
	{
		// execute query with page and limit values
		const condition = {};
		if(req.query.size) condition.size = req.query.size;
		if(req.query.bed) condition.bed = req.query.bed;
		if(req.query.name) condition.name = {$regex : '.*'+ req.query.name + '.*'};
		if(req.query.price) condition.price = req.query.price;
		if(req.query.floors) condition.floors = req.query.floors;
		if(req.query.category_id) condition.category_id = req.query.category_id;
		// if(req.query.size) condition.size = req.query.size;
		const paging = buildParamPaging( req.query );
		const rooms = await Room.find()
			.where( condition )
			.limit( paging.page_size )
			.skip( ( paging.page - 1 ) * paging.page_size )
			.exec();

		// get total documents in the Posts collection
		const count = await Room.count().where(condition);

		// return response with posts, total pages, and current page
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

exports.updateVoting = async ( data, number ) =>
{
	try
	{
		const room = await Room.findOne( { _id: data.room_id } );
		if ( room )
		{

			room.total_vote = room.total_vote ? Number( room.total_vote ) + number : number;
			room.total_star = room.total_star ? Number( room.total_star ) + Number( data.vote_number ) : Number( data.vote_number );
			await room.save();
		}
	} catch ( e )
	{
		throw e;
	}
};
