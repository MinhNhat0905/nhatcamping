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

	const [ form, setForm ] = useState( {
		user_id: getUser()?._id || 0,
		room_id: null,
		vote_content: null,
		vote_number: 0
	} );

	const [ review, setReview ] = useState( null );

	useEffect( () =>
	{
		if ( props.id )
		{
			getDetail( props.id );
		}
	}, [ props.id ] );



	const [ error, setError ] = useState( '' );

	const [ validated, setValidated ] = useState( false );

	const dispatch = useDispatch();

	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		if ( e?.currentTarget?.checkValidity() === false || error )
		{
			e.stopPropagation();
		} else
		{
			dispatch( toggleShowLoading( true ) );

			const response = await ReviewService.createData( form );
			if ( response?.status === 200 && response?.data )
			{

				toast( 'Review thành công!', { type: 'success', autoClose: 900 } );
				await timeDelay( 1000 );
				dispatch( toggleShowLoading( false ) );
				resetForm()
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
		props.setShowModal( false );
		setForm( {
			user_id: null,
			room_id: null,
			vote_content: null,
			vote_number: 0
		} );
		props.setId( null )
		setError( '' );
		setValidated( false );
		setReview( null );
	}

	const getDetail = async ( id ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await ReviewService.getDataList( { page: 1, page_size: 1, room_id: id, user_id: getUser()?._id } )
		if ( response?.status === 200 )
		{
			let reviewRs = response?.data?.votes || [];
			if ( reviewRs[ 0 ] )
			{
				setReview( reviewRs[ 0 ] );
				setForm( {
					user_id: reviewRs[ 0 ].user_id,
					room_id: reviewRs[ 0 ].room_id,
					vote_content: reviewRs[ 0 ].vote_content,
					vote_number: reviewRs[ 0 ].vote_number,
				} )
			} else
			{
				setForm( { ...form, room_id: props.id } );
			}
		} else
		{
			setForm( { ...form, room_id: props.id } );
		}
		dispatch( toggleShowLoading( false ) );
	}


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
									[ ...Array( 5 ) ].map( ( item, index ) =>
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
								readOnly={ review ? true : false }
								required={ false }
								key_name={ 'vote_content' } maxLength={ 320 } as={ 'textarea' } placeholder={ 'Nhập Nội dung' }
								type={ 'text' }
							/>
						</Form.Group>

					</Row>

					<Form.Group className="mb-3 d-flex justify-content-center">
						{
							!review && <button type="submit" className='btn btn-primary px-4 fs-18 py-2'>Cập nhật</button>
						}
						<button type="button"
							onClick={ ( e ) => { resetForm() } }
							className='ml-2 px-4 fs-18 py-2 btn btn-secondary'>Hủy bỏ</button>
					</Form.Group>
				</Form>
			</Modal.Body>

		</Modal>

	);
};

