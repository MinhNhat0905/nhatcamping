import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const facilityService = {
	// Hàm lấy danh sách tất cả tiện nghi
	async getFacilities (filters) {
		const params = buildFilter(filters);
		return await getMethod('facility', params); // Gọi API lấy danh sách tất cả tiện nghi
	  },
	  
	async getDataList ( filters, isSet, setSearchParams )
	{
		const params = buildFilter( filters );
		if ( isSet )
		{
			setSearchParams( params )

		}
		return await getMethod( 'facility', params );
	},

	async getDetailData ( id )
	{
		return await getMethod( 'facility/' + id );
	}
}
