import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod, uploadFile } from "../baseService";

export const OtherService = {
	async getListDiscount(filters) {
		const params = buildFilter(filters);
		return await getMethod('discount', params);
	},

	async getDetailDiscount(id) {
		return await getMethod('discount/' + id);
	},

	async getCategories(filters) {
		const params = buildFilter(filters);
		return await getMethod('category/', params);
	},
	
	async getDetailData(id) {
		return await getMethod('contact/' + id);
	},

	async createContact(data) {
		return await postMethod('contact', data);
	},
	
	async putData(id,data) {
		return await putMethod('contact/' + id, data);
	},

	async deleteData(id) {
		return await deleteMethod('contact/' + id);
	},

	async uploadFiles ( files )
	{
		let avatar = null;
		try
		{
			const formData = new FormData();
			formData.append( 'file', files);
			const res = await uploadFile(formData);
			if ( res.status === 200 )
			{
				avatar = res.data.filename;
			}
		} catch ( error )
		{
			
		}

		return avatar;

	},
}