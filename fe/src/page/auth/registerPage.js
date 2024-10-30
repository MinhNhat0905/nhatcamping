import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { setField, timeDelay } from "../../common/helper";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/feService/authService";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { toast } from "react-toastify";

const SignUpPage = () =>
{
	const [sex, setSex] = useState('Nam');
	const [ form, setForm ] = useState( {
		email: null,
		password: null,
		name: null,
		sex: null,
		birthday: null,
		type: 'USER',
		status: 1,
		phone: null
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
			dispatch(toggleShowLoading(true))
			console.log('---------------- FORM: ', form);
			form.sex = sex;
			const response = await AuthService.register( form );
			if ( response?.status === 200 && response?.data )
			{

				toast( 'Đăng ký thành công!', {type: 'success', autoClose: 900} );
				await timeDelay( 1000 );
				dispatch(toggleShowLoading(false))
				navigate( '/sign-in' );
			} else
			{
				toast( response?.message || response?.error  || 'Đăng ký thất bại', {type: 'error'} )
			}
			dispatch(toggleShowLoading(false))
		}

		setValidated( true );
	}

	const handleChangeSex = (event) => {
		setSex(event.target.value);
	}


	return (
		<div className='bg-auth d-flex'>
			<Container>
				<Row className='justify-content-center '>
					<Col md={ 6 }>
						<Card className="auth-box">
							<Card.Body className="w-100">
								<div className="text-center">
									<Link to={ '/' } className={ 'navbar-brand' }>
										<img src={'/logo.png'} style={{ width: "100px"}} />
									</Link>
									<h3 className="text-white fs-22">
										Đăng ký
									</h3>
								</div>
								<Form noValidate validated={ validated } onSubmit={ handleSubmit }>
									<Row>
										<Form.Group className="mb-3 col-12">
											<Form.Label className="text-white fs-19">Họ và tên: </Form.Label>
											<Form.Control required type="text" name={ 'name' } placeholder="Nhập họ và tên"
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

										<Form.Group className="mb-3 col-12">
											<Form.Label className="text-white fs-19">Email: </Form.Label>
											<Form.Control required type="email" name={ 'email' } placeholder="Nhập email"
												onChange={ event =>
												{
													let value = event && event.target.value.trim() || null;
													setField( form, 'email', value, setForm )
												} }
												value={ form.email || '' } />
											<Form.Control.Feedback type="invalid">
												Email không được để trống.
											</Form.Control.Feedback>
										</Form.Group>



										<Form.Group className="mb-3 col-12">
											<Form.Label className="text-white fs-19">Mật khẩu: </Form.Label>
											<Form.Control required type="password" name={ 'password' } placeholder="Nhập mật khẩu"
												onChange={ event =>
												{
													let value = event && event.target.value.trim() || null;
													setField( form, 'password', value, setForm )
												} }
												value={ form.password || '' } />
											<Form.Control.Feedback type="invalid">
												Mật khẩu không được để trống.
											</Form.Control.Feedback>
										</Form.Group>


										<Form.Group className="mb-3 col-12">
											<Form.Label className="text-white fs-19">Số điện thoại: </Form.Label>
											<Form.Control required type="text" name={ 'phone' } placeholder="Nhập số điện thoại"
												onChange={ event =>
												{
													let value = event && event.target.value.trim() || null;
													setField( form, 'phone', value, setForm )
												} }
												value={ form.phone || '' } />
											<Form.Control.Feedback type="invalid">
												Số điện thoại không được để trống.
											</Form.Control.Feedback>
										</Form.Group>

										{/*<Form.Group className="mb-3 col-md-6">*/}
										{/*	<Form.Label className="text-white fs-19">Giới tính: </Form.Label>*/}
										{/*	<Form.Control type="text" name={ 'sex' } placeholder="Nhập giới tính "*/}
										{/*		onChange={ event =>*/}
										{/*		{*/}
										{/*			let value = event && event.target.value.trim() || null*/}
										{/*			setField( form, 'sex', value, setForm )*/}
										{/*		} }*/}
										{/*		value={ form.sex || '' } />*/}

										{/*</Form.Group>*/}
										<Form.Group className="mb-3 col-md-6">
											<Form.Label className="text-white fs-19">Giới tính: </Form.Label>
											<Form.Select required aria-label="Default select example" className={'form-control'} onChange={handleChangeSex}>
												<option value="">-- Mời chọn giới tính --</option>
												<option value="nam">Nam</option>
												<option value="nu">Nữ</option>
											</Form.Select>
											<Form.Control.Feedback type="invalid">
												Giới tính không được để trống
											</Form.Control.Feedback>
										</Form.Group>

										<Form.Group className="mb-3 col-md-6">
											<Form.Label className="text-white fs-19">Ngày sinh: </Form.Label>
											<Form.Control type="date" name={ 'birthday' } placeholder="Nhập ngày sinh "
												onChange={ event =>
												{
													let value = event && event.target.value.trim() || null
													setField( form, 'birthday', value, setForm )
												} }
												value={ form.birthday || '' } />

										</Form.Group>
									</Row>


									<Form.Group className="mb-3 d-flex justify-content-center">
										<Button type="submit" className='btn btn-primary'>Đăng nhập</Button>
									</Form.Group>
								</Form>
								<div className="mt-4 text-center">
									<p className="mb-0 text-white">
										Nếu đã có tài khoản ?{ " " }
										<Link
											to="/sign-in"
											className="text-decoration-underline text-white"
										>
											{ " " }
											Đăng nhập{ " " }
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
};

export default SignUpPage;
