import { buildFilter } from "../../common/helper";
import { deleteMethod, getMethod, postMethod, putMethod } from "../baseService";

export const RoomService = {
	async getDataList ( filters, isSet, setSearchParams )// Hàm lấy danh sách phòng với các bộ lọc, có thể thiết lập URL search params
	{
		const params = buildFilter( filters );// Xây dựng các tham số query từ bộ lọc
		if ( isSet )
		{
			setSearchParams( params )// Thiết lập searchParams nếu isSet là true

		}
		return await getMethod( 'room', params );// Gửi yêu cầu GET đến endpoint 'room' với các tham số query
	},
	
	async getDetailData(id) {// Hàm lấy dữ liệu chi tiết của một phòng theo ID
		return await getMethod('room/' + id);// Gửi yêu cầu GET đến endpoint 'room/{id}'
	},
	async createData(data) {// Hàm tạo mới một phòng
		return await postMethod('room', data);// Gửi yêu cầu POST đến endpoint 'room' với dữ liệu phòng mới
	},
	async putData(id,data) {// Hàm cập nhật dữ liệu của một phòng theo ID
		return await putMethod('room/' + id, data);// Gửi yêu cầu PUT đến endpoint 'room/{id}' với dữ liệu cần cập nhật
	},

	async deleteData(id) {// Hàm xóa một phòng theo ID
		return await deleteMethod('room/' + id);// Gửi yêu cầu DELETE đến endpoint 'room/{id}'
	},
}