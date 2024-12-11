import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { setField, timeDelay } from "../../common/helper";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/feService/authService";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { toast } from "react-toastify";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase"; // Cấu hình Firebase
import { FaEye, FaEyeSlash } from "react-icons/fa";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

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
		confirmPassword: null,
		phone: null
	} );
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [ validated, setValidated ] = useState( false );
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible); // Chuyển đổi giữa hiện và ẩn mật khẩu
	  };
	
	  const toggleConfirmPasswordVisibility = () => {
		setConfirmPasswordVisible(!confirmPasswordVisible); // Chuyển đổi giữa hiện và ẩn mật khẩu xác nhận
	  };
	const handleSubmit = async ( e ) =>
	{
		// Kiểm tra mật khẩu và mật khẩu xác nhận có trùng khớp không
		if (form.password !== form.confirmPassword) {
			toast('Mật khẩu và mật khẩu xác nhận không khớp.', { type: 'error' });
			return;
		  }
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
	};
	const handleGoogleSignUp = async () => {
		try {
			dispatch(toggleShowLoading(true)); // Hiển thị loading
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
	
			// Lưu thông tin người dùng vào localStorage hoặc thực hiện xử lý thêm với server backend của bạn
			const formData = {
				email: user?.email,
				name: user?.displayName,
				avatar: user?.photoURL,
				type: "USER",
				status: 1,
			};
	
			// Gửi thông tin này đến backend nếu cần
			const response = await AuthService.register(formData);
	
			if (response?.status === 200) {
				toast('Đăng ký Google thành công!', { type: 'success', autoClose: 900 });
				await timeDelay(1000);
				navigate('/sign-in');
			} else {
				toast(response?.message || 'Đăng ký thất bại', { type: 'error' });
			}
		} catch (error) {
			console.error('Google Sign-Up Error:', error);
			toast('Đăng ký Google thất bại.', { type: 'error' });
		} finally {
			dispatch(toggleShowLoading(false)); // Tắt loading
		}
	};


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
                      <div className="input-group">
                        <Form.Control required
                          type={passwordVisible ? "text" : "password"} // Toggle between text and password
                          name={'password'}
                          placeholder="Nhập mật khẩu"
                          onChange={event => {
                            let value = event && event.target.value.trim() || null;
                            setField(form, 'password', value, setForm)
                          }}
                          value={form.password || ''} />
                        <Button
                          variant="outline-secondary"
                          onClick={togglePasswordVisibility}
                          style={{ cursor: 'pointer', border: 'none', background: 'transparent', width: '40px' }}>
                          {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle Eye icon */}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Mật khẩu không được để trống.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3 col-12">
                      <Form.Label className="text-white fs-19">Nhập lại mật khẩu: </Form.Label>
                      <div className="input-group">
                        <Form.Control required
                          type={confirmPasswordVisible ? "text" : "password"} // Toggle between text and password
                          name={'confirmPassword'}
                          placeholder="Nhập lại mật khẩu"
                          onChange={event => {
                            let value = event && event.target.value.trim() || null;
                            setField(form, 'confirmPassword', value, setForm)
                          }}
                          value={form.confirmPassword || ''} />
                        <Button
                          variant="outline-secondary"
                          onClick={toggleConfirmPasswordVisibility}
                          style={{ cursor: 'pointer', border: 'none', background: 'transparent', width: '40px' }}>
                          {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle Eye icon */}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        Mật khẩu xác nhận không được để trống.
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
										<Button type="submit" className='btn btn-primary'>Đăng ký</Button>
									</Form.Group>
									{/* <Form.Group className="mb-3 d-flex justify-content-center">
                                        <Button type="button" className="btn btn-danger" onClick={handleGoogleSignUp}>
                                            <i className="fab fa-google"></i> Đăng ký bằng Google
                                        </Button>
                                    </Form.Group> */}
								</Form>
								<div className="mt-4 text-center">
									<p className="mb-0 text-white">
									<Link
											to="/sign-in"
											className="text-decoration-underline text-white"
										>
										Nếu đã có tài khoản ?{ " " }
										
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
