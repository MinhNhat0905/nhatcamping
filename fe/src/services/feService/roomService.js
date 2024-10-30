import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const RoomService = {
	async getDataList ( filters, isSet, setSearchParams )
	{
		const params = buildFilter( filters );
		if ( isSet )
		{
			setSearchParams( params )

		}
		return await getMethod( 'room', params );
	},
	
	async getDetailData(id) {
		return await getMethod('room/' + id);
	},
	async createData(data) {
		return await postMethod('room', data);
	},
	async putData(id,data) {
		return await putMethod('room/' + id, data);
	},

	async deleteData(id) {
		return await deleteMethod('room/' + id);
	},
}