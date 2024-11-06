import React, { useEffect, useRef, useState } from "react";
import { Row, Form, Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { getUser, setField, timeDelay } from "../../common/helper";
import { toast } from "react-toastify";
import { InputBase } from "../base-form/controlInputForm";
import { ReviewService } from "../../services/feService/reviewService";
import { CloudSleet, Star, StarFill } from "react-bootstrap-icons";



export const FormVoteModal = ( props ) =>
{

	const [ form, setForm ] = useState( {// Khởi tạo state `form` để lưu trữ thông tin đánh giá với các trường
		user_id: getUser()?._id || 0,// `user_id`: ID của người dùng, lấy từ `getUser()` nếu có, nếu không thì mặc định là 0
		room_id: null,// `room_id`: ID của phòng (mặc định là null).
		vote_content: null,// `vote_content`: Nội dung của đánh giá (mặc định là null)
		vote_number: 0// `vote_number`: Số điểm đánh giá (mặc định là 0)
	} );

	const [ review, setReview ] = useState( null );// State `review` dùng để lưu trữ thông tin của đánh giá hiện tại nếu đã tồn tại

	useEffect( () =>
	{
		if ( props.id )
		{
			getDetail( props.id );
		}
	}, [ props.id ] );



	const [ error, setError ] = useState( '' );// State `error` lưu trữ thông báo lỗi (nếu có)

	const [ validated, setValidated ] = useState( false );// State `validated` để kiểm tra xem form có được validate hay chưa

	const dispatch = useDispatch();// Sử dụng `useDispatch` từ Redux để lấy hàm `dispatch` dùng khi gọi action

	const handleSubmit = async ( e ) =>
	{
		e.preventDefault(); // Ngăn chặn hành vi submit mặc định của form
		  // Kiểm tra nếu form không hợp lệ hoặc có lỗi, ngăn không cho submit tiếp
		if ( e?.currentTarget?.checkValidity() === false || error )
		{
			e.stopPropagation(); // Ngăn chặn sự kiện tiếp tục
		} else
		{
			dispatch( toggleShowLoading( true ) );// Hiển thị loading khi bắt đầu submit

			const response = await ReviewService.createData( form ); // Gọi API tạo đánh giá mới với dữ liệu trong `form`
			if ( response?.status === 200 && response?.data )
			{
 				// Nếu API trả về thành công, hiển thị thông báo và tắt modal
				toast( 'Review thành công!', { type: 'success', autoClose: 900 } );
				await timeDelay( 1000 );
				dispatch( toggleShowLoading( false ) );
				resetForm()// Reset form sau khi submit thành công
			} else
			{
				toast( response?.message || 'Review thất bại!', { type: 'error', autoClose: 900 } )
			}
			dispatch( toggleShowLoading( false ) )
		}
		setValidated( true );
	}

	const resetForm = () =>
	{
		props.setShowModal( false ); // Đóng modal
		setForm( {// Reset lại state `form` về giá trị mặc định
			user_id: null,
			room_id: null,
			vote_content: null,
			vote_number: 0
		} );
		props.setId( null )// Xóa ID của phòng trong `props`
		setError( '' );// Xóa thông báo lỗi nếu có
		setValidated( false );// Reset trạng thái validate
		setReview( null ); // Xóa thông tin review
	}

	const getDetail = async ( id ) =>
	{
		dispatch( toggleShowLoading( true ) );
		// Gọi API lấy chi tiết đánh giá của người dùng cho phòng với `id` đã chọn
		const response = await ReviewService.getDataList( { page: 1, page_size: 1, room_id: id, user_id: getUser()?._id } )
		if ( response?.status === 200 )
		{
			let reviewRs = response?.data?.votes || [];
			if ( reviewRs[ 0 ] ) // Nếu có đánh giá, set `review` và cập nhật `form` với dữ liệu này
			{
				setReview( reviewRs[ 0 ] );
				setForm( {
					user_id: reviewRs[ 0 ].user_id,
					room_id: reviewRs[ 0 ].room_id,
					vote_content: reviewRs[ 0 ].vote_content,
					vote_number: reviewRs[ 0 ].vote_number,
				} )
			} else// Nếu không có đánh giá nào, chỉ cập nhật `room_id` trong `form`
			{
				setForm( { ...form, room_id: props.id } );
			}
		} else
		{
			setForm( { ...form, room_id: props.id } );
		}
		dispatch( toggleShowLoading( false ) );// Tắt loading sau khi gọi API xong
	}

	// Modal cho phép người dùng thực hiện đánh giá phòng
	return (
		<Modal show={ props.showModal }
			// onHide={ resetForm }
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton={ false } className="text-center">
				<Modal.Title className="text-center w-100">Review phòng</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form noValidate validated={ validated } onSubmit={ handleSubmit }>
					<Row>
						<Form.Group className="mb-3 col-xl-12 ">
							<Form.Label>Chọn số điểm Review: </Form.Label>
							<div className="d-flex justify-content-center review">

								{
									[ ...Array( 5 ) ].map( ( item, index ) => // Hiển thị các ngôi sao đánh giá
									{
										if ( index < props.vote_number )
										{
											return (
												<StarFill key={ index }
													className={ `star active ${ index > 0 ? 'ml-2' : '' }` }
													onClick={ () =>
													{
														setField( form, 'vote_number', index + 1, setForm )
													} }
												/>
											);
										}
										return (
											<StarFill key={ index }
												className={ `star
											${ index > 0 ? 'ml-2' : '' } ${ index < form.vote_number ? 'active' : '' }` }
												onClick={ () =>
												{
													setField( form, 'vote_number', index + 1, setForm )
												} }
											/>
										);
									} )
								}
							</div>
							{

								error && <p className="text-danger"> { error }</p>
							}
						</Form.Group>

						<Form.Group className="mb-3 col-xl-12 fs-18">
							<InputBase form={ form } setForm={ setForm } name={ 'vote_content' }
								label={ 'Nội dung: ' }
								rows={ 5 }
								readOnly={ review ? true : false }// Chỉ đọc nếu có đánh giá
								required={ false }
								key_name={ 'vote_content' } maxLength={ 320 } as={ 'textarea' } placeholder={ 'Nhập Nội dung' }
								type={ 'text' }
							/>
						</Form.Group>

					</Row>

					<Form.Group className="mb-3 d-flex justify-content-center">
						{// Hiển thị nút cập nhật nếu không có đánh giá
							!review && <button type="submit" className='btn btn-primary px-4 fs-18 py-2'>Cập nhật</button>
						}
						<button type="button"
							onClick={ ( e ) => { resetForm() } }// Gọi hàm resetForm khi nhấn nút hủy
							className='ml-2 px-4 fs-18 py-2 btn btn-secondary'>Hủy bỏ</button>
					</Form.Group>
				</Form>
			</Modal.Body>

		</Modal>

	);
};

