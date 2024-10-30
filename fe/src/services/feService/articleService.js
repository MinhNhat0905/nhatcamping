import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const ArticleService = {
	async getDataList ( filters, isSet, setSearchParams )
	{
		const params = buildFilter( filters );
		if ( isSet )
		{
			setSearchParams( params )

		}
		return await getMethod( 'article', params );
	},

	async getDetailData ( id )
	{
		return await getMethod( 'article/' + id );
	},
	async createData ( data )
	{
		return await postMethod( 'article', data );
	},
	async putData ( id, data )
	{
		return await putMethod( 'article/' + id, data );
	},

	async deleteData ( id )
	{
		return await deleteMethod( 'article/' + id );
	},
}