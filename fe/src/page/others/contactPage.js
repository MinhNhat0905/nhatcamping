import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleShowLoading } from "../../redux/actions/common";
import { OtherService } from "../../services/feService/otherService";
import { setField, timeDelay } from "../../common/helper";
import { toast } from "react-toastify";
import { BookmarkStar, ListStars, MoonStars, Star } from "react-bootstrap-icons";


const ContactPage = () =>
{
	document.title = 'Liên hệ';
	const [ form, setForm ] = useState( {
		name: null,
		email: null,
		subject: null,
		message: null
	} );

	const [ validated, setValidated ] = useState( false );

	const navigate = useNavigate();
	const dispatch = useDispatch();


	const handleSubmit = async ( e ) =>
	{
		e.preventDefault();
		if ( e?.currentTarget?.checkValidity() === false )
		{
			e.stopPropagation();
		} else
		{
			dispatch( toggleShowLoading( true ) )
			const response = await OtherService.createContact( form );
			if ( response?.status === 200 && response?.data )
			{

				toast( 'Gửi yêu cầu thành công!', { type: 'success', autoClose: 900 } );
				setForm( {
					name: null,
					email: null,
					subject: null,
					message: null
				});
				setValidated(false);
				await timeDelay( 1000 );
				dispatch( toggleShowLoading( false ) );

				window.location.href = '/contact' ;
			} else
			{
				toast( response?.message || response?.error || 'Có lỗi sảy ra', { type: 'error', autoClose: 900 } );
				dispatch( toggleShowLoading( false ) );

			}
		}

		setValidated( true );

	}
	return (
		<React.Fragment>
			<section className={ `ftco-section bg-light` }>
				<Container>
				<Star/>
					<Row className="row justify-content-center mb-5 pb-3">
						<Col md={ 7 } className="heading-section text-center">
							<h2 className="mb-4">Liên hệ</h2>
						</Col>
					</Row>
					<Row>
						<Col md={ 3 } className="d-flex">
							<div className="info bg-white p-4">
								<p><span>Address:</span> 87/18 Đường Cầu Đình, Long Phước, Tp Thủ Đức</p>
							</div>
						</Col>
						<Col md={ 3 } className="d-flex">
							<div className="info bg-white p-4">
								<p><span>Phone:</span> <a href="tel://1234567920">+ 1235 2355 98</a></p>
							</div>
						</Col>
						<Col md={ 3 } className="d-flex">
							<div className="info bg-white p-4">
								<p><span>Email:</span> <a href="deluxe@gmail.com">deluxe@gmail.com</a></p>
							</div>
						</Col>
						<Col md={ 3 } className="d-flex">
							<div className="info bg-white p-4">
								<p><span>Website</span> <a href="yoursite.com">yoursite.com</a></p>
							</div>
						</Col>
					</Row>
					<Row className="block-9 mt-5">
						<Col md={ 6 } className="order-md-last d-flex justify-content-center">
							<Form className="bg-white p-5 contact-form w-75" noValidate validated={ validated } onSubmit={ handleSubmit }>
								<Form.Group className="mb-3">
									<Form.Control required type="text" name={ 'name' } placeholder="Họ và tên"
										onChange={ event =>
										{
											let value = event && event.target.value.trim() || null;
											setField( form, 'name', value, setForm )
										} }
										value={ form.name || '' } />
									<Form.Control.Feedback type="invalid">
										Tên không được để trống.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Control required type="email" name={ 'email' } placeholder="Email"
										onChange={ event =>
										{
											let value = event && event.target.value.trim() || null
											setField( form, 'email', value, setForm )
										} }
										value={ form.email || '' } />
									<Form.Control.Feedback type="invalid">
										Email không được để trống.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Control required type="text" name={ 'subject' } placeholder="Tiêu đề"
										onChange={ event =>
										{
											let value = event && event.target.value.trim() || null
											setField( form, 'subject', value, setForm )
										} }
										value={ form.subject || '' } />
									<Form.Control.Feedback type="invalid">
										Tiêu đề không được để trống.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3">
									<Form.Control as="textarea" rows={ 7 } required type="text" name={ 'message' } placeholder="Nội dung"
										onChange={ event =>
										{
											let value = event && event.target.value.trim() || null
											setField( form, 'message', value, setForm )
										} }
										value={ form.message || '' } />
									<Form.Control.Feedback type="invalid">
										Nội dung không được để trống.
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group className="mb-3 d-flex justify-content-center">
									<Button type="submit" className='btn btn-primary py-3 px-5'>Send message</Button>
								</Form.Group>
							</Form>
						</Col>
						<Col md={ 6 } className="d-flex">
							<div id="map" className="bg-white" style={ { position: "relative", overflow: "hidden" } }>
								<div
									style={ { position: "absolute", height: "100%", width: "100%"} }
								>
									<div className="gm-err-container">
										<div className="gm-err-content">
											<div className="gm-err-icon">
												<iframe
													src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.9423106499294!2d106.86776617588775!3d10.815726889335458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521a92fd118d3%3A0xa6a9c754f5357551!2zODcvMTQgxJDGsOG7nW5nIEPhuqd1IMSQw6xuaCwgS2h1IHBo4buRIGzDom4gbmdvw6BpLCBRdeG6rW4gOSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1693108142157!5m2!1svi!2s"
													width="600" height="450" style={{ border: 0}}  allowFullScreen=""
													loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</React.Fragment>
	);
};

export default ContactPage;
