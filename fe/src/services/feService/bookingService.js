import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const BookingService = {
	async getDataList ( filters, isSet, setSearchParams )// Hàm lấy danh sách booking với các bộ lọc, có thể thiết lập URL search params
	{
		const params = buildFilter( filters );// Xây dựng các tham số query từ bộ lọc
		if ( isSet )
		{
			setSearchParams( params )// Thiết lập searchParams nếu isSet là true

		}
		return await getMethod( 'booking', params );// Gửi yêu cầu GET đến endpoint 'booking' với các tham số query
	},

	async getDetailData ( id )// Hàm lấy dữ liệu chi tiết của một booking theo ID
	{
		return await getMethod( 'booking/' + id );// Gửi yêu cầu GET đến endpoint 'booking/{id}'
	},
	async createData ( data )// Hàm tạo mới một booking
	{
		return await postMethod( 'booking', data ); // Gửi yêu cầu POST đến endpoint 'booking' với dữ liệu booking mới
	},
	async putData ( id, data )// Hàm cập nhật dữ liệu của một booking theo ID
	{
		return await putMethod( 'booking/' + id, data );// Gửi yêu cầu PUT đến endpoint 'booking/{id}' với dữ liệu cần cập nhật
	},

	async deleteData ( id )// Hàm xóa một booking theo ID
	{
		return await deleteMethod( 'booking/' + id ); // Gửi yêu cầu DELETE đến endpoint 'booking/{id}'
	},
	async cancel ( id )// Hàm hủy một booking theo ID
	{
		return await postMethod( 'booking/cancel/' + id );// Gửi yêu cầu POST đến endpoint 'booking/cancel/{id}'
	},
	
}
