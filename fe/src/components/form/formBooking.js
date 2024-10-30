import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toggleShowLoading } from "../../redux/actions/common";
import { OtherService } from "../../services/feService/otherService";
import { caculateDateTime, customNumber, getItem, getUser, setField, timeDelay } from "../../common/helper";
import { toast } from "react-toastify";
import { InputBase } from "../base-form/controlInputForm";
import { SelectBase } from "../base-form/selectForm";
import { RoomService } from "../../services/feService/roomService";
import { BookingService } from "../../services/feService/bookingService";

const paymentType = [
	// {
	// 	_id: 1,
	// 	name: 'Tiền mặt'
	// },
	{
		_id: 2,
		name: 'Online'
	}
];
export const FormBooking = () =>
{
	document.title = 'Đặt phòng';

	const [ rooms, setRooms ] = useState( [] );
	const [ discounts, setDiscounts ] = useState( [] );

	const [ form, setForm ] = useState( {
		check_in: null,
		check_out: null,
		amount_of_people: null,
		room_id: null,
		user_id: null,
		discount_id: null,
		discount: 0,
		status: 'PENDING',
		status_payment: 'UNPAID',
		price: 0,
		total_money: 0,
		customer_name: null,
		customer_email: null,
		customer_phone: null,
		payment_type: 1,
	} );

	const [ validated, setValidated ] = useState( false );



	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = getUser();
	const params = useParams();


	useEffect( () =>
	{
		getDataList();
		getListDiscount();
		let data = { ...form };
		if ( user )
		{
			data.user_id = user._id;
			data.customer_email = user.email;
			data.customer_name = user.name
		}
		if ( params.id )
		{
			data.room_id = params.id;
		}
		setForm( data );
	}, [ params.id ] );

	useEffect( () =>
	{
		if ( form.room_id && rooms?.length > 0 )
		{
			let data = rooms.find( item => item._id === form.room_id );
			let price = data?.price || 0;
			if ( form.check_in && form.check_out )
			{
				let numberDate = caculateDateTime( form.check_in, form.check_out );
				setForm( { ...form, price: price * numberDate } );
			}

		}
	}, [ form.room_id, form.check_in, form.check_out ] );

	useEffect( () =>
	{
		if ( form.discount_id && discounts?.length > 0 )
		{
			let data = discounts.find( item => item._id === form.discount_id );
			let discount = data?.price || 0;
			setForm( { ...form, discount: discount } );

		}
	}, [ form.discount_id ] )



	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		if ( e?.currentTarget?.checkValidity() === false )
		{
			e.stopPropagation();
		} else
		{
			form.total_money = form.price - form.discount;
			form.payment_type = Number( form.payment_type );
			form.discount_id = Number( form.discount_id );
			dispatch( toggleShowLoading( true ) );

			const response = await BookingService.createData( form );
			console.log('----------------- response booking: ', response)
			if ( response?.status === 200 && response?.data )
			{
				toast( 'đặt phòng thành công!', { type: 'success', autoClose: 900 } );
				resetForm();
				dispatch( toggleShowLoading( false ) );



				if ( response?.data?.link )
				{
					window.open( response?.data?.link, '_blank ' );
				} else
				{
					resetForm();
				}
				if ( getUser() )
				{
					navigate( '/booking' );
				} else
				{
					// view mới
					window.location.href = '/payment/booking-success';
				}

			} else
			{
				toast( response?.message || response?.error || 'Có lỗi sảy ra', { type: 'error', autoClose: 900 } );
				dispatch( toggleShowLoading( false ) );
			}
		}

		setValidated( true );

	}

	const resetForm = () =>
	{
		setForm( {
			check_in: null,
			check_out: null,
			amount_of_people: null,
			room_id: null,
			user_id: null,
			discount_id: null,
			discount: 0,
			status: 'PENDING',
			status_payment: 'UNPAID',
			price: 0,
			total_money: 0,
			customer_name: null,
			customer_email: null,
			customer_phone: null,
			payment_type: 2,
		} );
		setValidated( false );
	}
	const getDataList = async () =>
	{

		dispatch( toggleShowLoading( true ) );
		const rs = await RoomService.getDataList( { page: 1, page_size: 1000, status: 1 } );
		if ( rs?.status === 200 )
		{

			setRooms( rs?.data?.rooms || [] );
		} else
		{
			setRooms( [] );
		}
		dispatch( toggleShowLoading( false ) );
	};

	const getListDiscount = async () =>
	{
		const rs = await OtherService.getListDiscount( { page: 1, page_size: 1000, status: 1 } );
		if ( rs?.status === 200 )
		{

			setDiscounts( rs?.data?.discounts || [] );
		} else
		{
			setDiscounts( [] );
		}
	}


	return (
		<React.Fragment>
			<section className={ `ftco-section bg-light` }>
				<Container>
					<Row className="row justify-content-center mb-5 pb-3">
						<Col md={ 7 } className="heading-section text-center">
							<h2 className="mb-4">Mẫu đặt phòng</h2>
						</Col>
					</Row>

					<Row className="block-9 mt-5">
						<Col md={ 12 } className="d-flex justify-content-center">
							<Form className="bg-white p-5 w-100 row" noValidate validated={ validated } onSubmit={ handleSubmit }>

								<Form.Group className="mb-3 col-xl-6">
									<InputBase form={ form } setForm={ setForm } name={ 'check_in' }
										label={ 'Check in: ' }
										key_name={ 'check_in' } required={ true } placeholder={ 'Thời gian check in' }
										type={ 'date' } error={ 'Vui lòng nhập Thời gian check in.' }
									/>
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<InputBase form={ form } setForm={ setForm } name={ 'checkout' }
										label={ 'Check out: ' }
										key_name={ 'check_out' } required={ true } placeholder={ 'Checkout' }
										type={ 'date' } error={ 'Vui lòng nhập Thời gian check out.' }
									/>
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<InputBase form={ form } setForm={ setForm } name={ 'name' }
										label={ 'Họ và tên: ' }
										key_name={ 'customer_name' } required={ true } placeholder={ 'Họ và tên' }
										type={ 'text' } error={ 'Vui lòng nhập họ tên đầy đủ.' }
									/>
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<InputBase form={ form } setForm={ setForm } name={ 'email' }
										label={ 'Email: ' }
										key_name={ 'customer_email' } required={ true } placeholder={ 'Email' }
										type={ 'email' } error={ 'Vui lòng nhập email.' }
									/>
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<InputBase form={ form } setForm={ setForm } name={ 'customer_phone' }
										label={ 'Số điện thoại: ' }
										key_name={ 'customer_phone' } required={ true } placeholder={ 'Số điện thoại' }
										type={ 'text' } error={ 'Vui lòng nhập số điện thoại.' }
									/>
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<InputBase form={ form } setForm={ setForm } name={ 'amount_of_people' }
										label={ 'Số người: ' }
										key_name={ 'amount_of_people' } required={ true } placeholder={ 'Số người' }
										type={ 'text' } error={ 'Vui lòng nhập số người.' }
									/>
								</Form.Group>



								<Form.Group className="mb-3 col-xl-6">
									<SelectBase form={ form } setForm={ setForm } name={ 'room_id' }
										label={ 'Phòng: ' } data={ rooms }
										key_name={ 'room_id' } required={ true } placeholder={ 'Chọn phòng' }
										type={ 'text' } error={ 'Vui lòng chọn phòng.' } />
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<SelectBase form={ form } setForm={ setForm } name={ 'discount_id' }
										label={ 'Mã giảm giá: ' } data={ discounts }
										key_name={ 'discount_id' } required={ false } placeholder={ 'Chọn mã giảm giá' }
										type={ 'text' } />
								</Form.Group>

								<Form.Group className="mb-3 col-xl-6">
									<SelectBase form={ form } setForm={ setForm } name={ 'payment_type' }
										data={ paymentType }
										label={ 'Phương thức thanh toán: ' }
										key_name={ 'payment_type' } required={ true } placeholder={ 'Chọn phương thức thanh toán' }
										type={ 'text' } error={ 'Vui lòng chọn phương thức thanh toán.' }
									/>
								</Form.Group>
								{/*<Form.Group className="mb-3 col-xl-6">*/}
								{/*	<InputBase form={ form } setForm={ setForm } name={ 'payment_type' }*/}
								{/*			   label={ 'Phương thức thanh toán: ' }*/}
								{/*			   key_name={ 'customer_phone' } required={ true } placeholder={ '2' }*/}
								{/*			   type={ 'text' } error={ 'Vui lòng chọn phương thức thanh toán.' }*/}
								{/*	/>*/}
								{/*</Form.Group>*/}

								<Col xl={ 12 } className="w-100 row">
									<Form.Group className="mb-3 col-xl-4">
										<Form.Label className="fs-19">Số tiền: </Form.Label>
										<p className="text-dark fs-19">{ customNumber( form.price, '.', 'đ' ) }</p>
									</Form.Group>

									<Form.Group className="mb-3 col-xl-4">
										<Form.Label className="fs-19">Discount: </Form.Label>
										<p className="text-dark fs-19">{ customNumber( form.discount, '.', 'đ' ) }</p>
									</Form.Group>

									<Form.Group className="mb-3 col-xl-4">
										<Form.Label className="fs-19">Tổng tiền: </Form.Label>
										<p className="text-dark fs-19">{ customNumber( form.price - form.discount, '.', 'đ' ) }</p>
									</Form.Group>

									<Form.Group className="mb-3 col-12 d-flex justify-content-center">
										<Button type="submit" className='btn btn-primary py-3 px-5'>Đặt phòng</Button>
									</Form.Group>
								</Col>
							</Form>
						</Col>

					</Row>
				</Container>
			</section>
		</React.Fragment>
	);
};

