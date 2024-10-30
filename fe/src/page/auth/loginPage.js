import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from '../../services/feService/authService';
import { setField, timeDelay } from '../../common/helper';
import { useDispatch } from 'react-redux';
import { toggleShowLoading } from '../../redux/actions/common';
import { toast } from "react-toastify";


export const SignInPage = () =>
{
	const [ form, setForm ] = useState( {
		email: null,
		password: null
	} );

	const [validated, setValidated] = useState(false);

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
			dispatch(toggleShowLoading(true))
			const response = await AuthService.login( form );
			if ( response?.status === 200 && response?.data )
			{
				localStorage.setItem( 'access_token', response.data.accessToken );
				let user = {
					name: response.data.user?.name,
					email: response.data.user?.email,
					avatar: response.data.user?.avatar,
					_id: response.data.user?._id,
					phone:  response.data.user?.phone || null
				};
				localStorage.setItem( 'user', JSON.stringify( user ) );
				toast( 'Đăng nhập thành công!', {type: 'success', autoClose: 900} );
				await timeDelay( 1000 )
				window.location.href = '/'
			} else
			{
				toast( response?.message || 'Đăng nhập thất bại', {type: 'error'} )
			}
			dispatch(toggleShowLoading(false));
		}

		setValidated(true);

	}
	return (
		<div className='bg-auth d-flex'>
			<Container>
				<Row className='justify-content-center '>
					<Col md={ 6 } lg={ 4 }>
						<Card className="auth-box">
							<Card.Body className="w-100">
								<div className="text-center">
									<Link to={ '/' } className={ 'navbar-brand' }>
										<img src={'/logo.png'} style={{ width: "100px"}} />
									</Link>
									<h3 className="text-white fs-22">
										Đăng nhập
									</h3>
								</div>
								<Form noValidate validated={validated} onSubmit={ handleSubmit }>
									<Form.Group className="mb-3">
										<Form.Label className="text-white fs-19">Email: </Form.Label>
										<Form.Control required type="email" name={ 'name' } placeholder="Nhập email"
											onChange={ event =>
											{
												let value = event && event.target.value.trim() || null;
												console.log( value );
												setField( form, 'email', value, setForm )
											} }
											value={ form.email || '' } />
										<Form.Control.Feedback type="invalid">
											Email không được để trống.
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label className="text-white fs-19">Mật khẩu: </Form.Label>
										<Form.Control required type="password" name={ 'password' } placeholder="Nhập mật khẩu"
											onChange={ event =>
											{
												let value = event && event.target.value.trim() || null
												setField( form, 'password', value, setForm )
											} }
											value={ form.password || '' } />
										<Form.Control.Feedback type="invalid">
											Mật khẩu không được để trống.
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="mb-3 d-flex justify-content-center">
										<Button type="submit" className='btn btn-primary'>Đăng nhập</Button>
									</Form.Group>
								</Form>
								<div className="mt-4 text-center">
									<p className="mb-0 text-white">
										Nếu không có tài khoản ?{ " " }
										<Link
											to="/sign-up"
											className="text-decoration-underline text-white"
										>
											{ " " }
											Đăng ký{ " " }
										</Link>
									</p>
								</div>
							</Card.Body>
						</Card>
					</Col>

				</Row>
			</Container>
		</div>
	);
}
