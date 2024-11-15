import React, { useEffect, useState } from "react";
import { CarouselImg } from "../../components/common/carosel";
import { RoomList } from "../../components/room-service/roomList";
import { BlogList } from "../../components/blog/blogList";
import { RoomService } from "../../services/feService/roomService";
import { ArticleService } from "../../services/feService/articleService";
import { ERROR_IMG, SUCCESS_GIF, SUCCESS_IMG, defaultA, defaultB } from "../../common/constant";
import { BookmarkStar } from "react-bootstrap-icons";
import { Card, Container } from "react-bootstrap";
import { useParams } from "react-router";



export const PaymentStatus = () =>
{
	document.title = 'Thanh toán';

	const [ img, setImg ] = useState( null );
	const [ title, setTitle ] = useState( '' );
	const [ content, setContent ] = useState( '' );

	const params = useParams();
// Hook useEffect sẽ chạy khi `params.type` thay đổi
	useEffect( () =>
	{
		if ( params.type === 'error' )// Kiểm tra loại trạng thái từ tham số `type`
		{
			setImg( ERROR_IMG );// Nếu `type` là 'error', hiển thị ảnh thất bại
			setTitle( 'thất bại' );
		} else if(params.type === 'success')
		{
			setImg( SUCCESS_IMG );// Nếu `type` là 'success', hiển thị ảnh thành công
			setTitle( 'thành công' );
		}else {
			setImg( SUCCESS_IMG );// Nếu không có `type` hợp lệ, mặc định là thành công
			setContent( 'Booking thành công' );
		}
	}, [ params.type ] )// Tham số phụ thuộc là `params.type`

	return (
		<React.Fragment>

			<Container style={ { paddingTop: '7em', paddingBottom: '7em' } }>
				{
					img && <img src={ img } alt='payment' className="d-block mx-auto" />
				}
				{ content ? (
					<h2 className="text-center">{ content }</h2>
				) : (
					<h2 className="text-center">Thanh toán { title }</h2>
				)}
			</Container>

		</React.Fragment>
	);
};

