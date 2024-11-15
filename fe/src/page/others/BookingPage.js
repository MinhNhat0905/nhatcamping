import React, { useEffect, useState } from "react";
import { BlogList } from "../../components/blog/blogList";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { ArticleService } from "../../services/feService/articleService";
import { useParams } from "react-router";
import { menuService } from "../../services/feService/menuService";
import { BookingService } from "../../services/feService/bookingService";
import { BookingList } from "../../components/booking/bookingList";
import { useSearchParams } from "react-router-dom";
import { getUser } from "../../common/helper";
import { INIT_PAGING } from "../../common/constant";

export const BookingPage = () =>
{
	document.title = 'Lịch sử đặt phòng';

	const [data, setData] = useState([]); // State để lưu danh sách đặt phòng
	const [title, setTitle] = useState('Lịch sử đặt phòng'); // State để lưu tiêu đề
	const [paging, setPaging] = useState(INIT_PAGING); // State để lưu thông tin phân trang
	const [params, setParams] = useState({ // State để lưu các tham số tìm kiếm
		status: null,
		status_payment: null,
		room_id: null,
		check_in: null,
		check_out: null
	} );

	const paramQuery = useParams(); // Lấy các tham số từ URL
	let [searchParams, setSearchParams] = useSearchParams({}); // Khởi tạo các tham số tìm kiếm

	const [showModal, setShowModal] = useState(false); // State để kiểm soát hiển thị modal
	const [id, setId] = useState(null); // State để lưu ID của đặt phòng khi cần thiết

	const dispatch = useDispatch(); // Khởi tạo hook dispatch
	useEffect(() => {
		getDataList({ page: 1, page_size: INIT_PAGING.page_size }); // Gọi lại hàm lấy dữ liệu sau khi cập nhật
	}, [params]); // Theo dõi sự thay đổi của params // Chạy effect chỉ một lần khi component được mount

	const getDataList = async ( params ) =>// Hàm lấy danh sách đặt phòng
	{

		dispatch( toggleShowLoading( true ) );// Bắt đầu hiển thị trạng thái loading
		let user = getUser();// Lấy thông tin người dùng
		const rs = await BookingService.getDataList( {...params, user_id: user._id}, true, setSearchParams );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.bookings || [] );// Cập nhật dữ liệu danh sách đặt phòng
			setPaging( rs?.meta || INIT_PAGING );// Cập nhật thông tin phân trang
		} else
		{
			setData([]); // Đặt lại danh sách về mảng rỗng nếu có lỗi
			setPaging(INIT_PAGING); // Đặt lại thông tin phân trang
		}
		dispatch( toggleShowLoading( false ) );// Dừng hiển thị trạng thái loading
	};
	return (
		<React.Fragment>

			<BookingList
				data={ data }
				getDataList={ getDataList }
				paging={ paging }
				params={ params }
				title={title}
				showModal={showModal}
				id={id}
				setShowModal={setShowModal}
				setId={setId}
			/>
		</React.Fragment>
	);
};

