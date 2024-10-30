import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const ServiceHotelService = {
	async getDataList ( filters, isSet, setSearchParams )
	{
		const params = buildFilter( filters );
		if ( isSet )
		{
			setSearchParams( params )

		}
		return await getMethod( 'service', params );
	},
	
	async getDetailData(id) {
		return await getMethod('service/' + id);
	},
	async createData(data) {
		return await postMethod('service', data);
	},
	async putData(id,data) {
		return await putMethod('service/' + id, data);
	},

	async deleteData(id) {
		return await deleteMethod('service/' + id);
	},
}