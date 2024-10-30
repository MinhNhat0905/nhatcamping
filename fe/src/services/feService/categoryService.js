import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const categoryService = {
	async getDataList ( filters, isSet, setSearchParams )
	{
		const params = buildFilter( filters );
		if ( isSet )
		{
			setSearchParams( params )

		}
		return await getMethod( 'category', params );
	},

	async getDetailData ( id )
	{
		return await getMethod( 'category/' + id );
	}
}
