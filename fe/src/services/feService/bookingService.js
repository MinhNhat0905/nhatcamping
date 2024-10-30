import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const BookingService = {
	async getDataList ( filters, isSet, setSearchParams )
	{
		const params = buildFilter( filters );
		if ( isSet )
		{
			setSearchParams( params )

		}
		return await getMethod( 'booking', params );
	},

	async getDetailData ( id )
	{
		return await getMethod( 'booking/' + id );
	},
	async createData ( data )
	{
		return await postMethod( 'booking', data );
	},
	async putData ( id, data )
	{
		return await putMethod( 'booking/' + id, data );
	},

	async deleteData ( id )
	{
		return await deleteMethod( 'booking/' + id );
	},
	async cancel ( id )
	{
		return await postMethod( 'booking/cancel/' + id );
	},
}
