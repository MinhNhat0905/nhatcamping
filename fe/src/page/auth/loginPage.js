import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from '../../services/feService/authService';
import { setField, timeDelay } from '../../common/helper';
import { useDispatch } from 'react-redux';
import { toggleShowLoading } from '../../redux/actions/common';
import { toast } from "react-toastify";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import GoogleImg from "../../assets/images/googleImg.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Khởi tạo auth và provider Google
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export const SignInPage = () => {
    const [form, setForm] = useState({
        email: null,
        password: null,
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible); // Toggle visibility
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e?.currentTarget?.checkValidity() === false) {
            e.stopPropagation();
        } else {
            dispatch(toggleShowLoading(true));
            const response = await AuthService.login(form);
            if (response?.status === 200 && response?.data) {
                localStorage.setItem('access_token', response.data.accessToken);
                let user = {
                    name: response.data.user?.name,
                    email: response.data.user?.email,
                    avatar: response.data.user?.avatar,
                    _id: response.data.user?._id,
                    phone: response.data.user?.phone || null
                };
                localStorage.setItem('user', JSON.stringify(user));
                toast('Đăng nhập thành công!', { type: 'success', autoClose: 900 });
                await timeDelay(1000);
                window.location.href = '/';
            } else {
                toast(response?.message || 'Đăng nhập thất bại', { type: 'error' });
            }
            dispatch(toggleShowLoading(false));
        }

        setValidated(true);
    };

    const handleGoogleSignIn = async () => {
        try {
            // Đăng xuất người dùng hiện tại để chọn tài khoản khác
            await signOut(auth);

            // Đăng nhập với Google
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Đăng nhập thành công với Google: ", user);

            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('access_token', user.accessToken);
            let userData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                _id: user.uid,
                phone: user.phoneNumber || null
            };
            localStorage.setItem('user', JSON.stringify(userData));

            toast('Đăng nhập Google thành công!', { type: 'success', autoClose: 900 });
            window.location.href = '/'; // Chuyển hướng về trang chính
        } catch (error) {
            console.error("Lỗi đăng nhập Google: ", error.message);
            toast('Đăng nhập Google thất bại', { type: 'error' });
        }
    };

    return (
        <div className='bg-auth d-flex'>
            <Container>
                <Row className='justify-content-center'>
                    <Col md={6} lg={4}>
                        <Card className="auth-box">
                            <Card.Body className="w-100">
                                <div className="text-center">
                                    <Link to={'/'} className={'navbar-brand'}>
                                        <img src={'/logo.png'} style={{ width: "100px" }} />
                                    </Link>
                                    <h3 className="text-white fs-22">Đăng nhập</h3>
                                </div>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-white fs-19">Email: </Form.Label>
                                        <Form.Control required type="email" name={'email'} placeholder="Nhập email"
                                            onChange={event => {
                                                let value = event.target.value.trim() || null;
                                                setField(form, 'email', value, setForm);
                                            }}
                                            value={form.email || ''} />
                                        <Form.Control.Feedback type="invalid">
                                            Email không được để trống.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-white fs-19">Mật khẩu: </Form.Label>
                                        <div className="input-group">
                                            <Form.Control required 
                                                type={passwordVisible ? "text" : "password"} // Toggle between text and password
                                                name={'password'} 
                                                placeholder="Nhập mật khẩu"
                                                onChange={event => {
                                                    let value = event.target.value.trim() || null;
                                                    setField(form, 'password', value, setForm);
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

                                    <Form.Group className="mb-3 d-flex justify-content-center">
                                        <Button type="submit" className='btn btn-primary'>Đăng nhập</Button>
                                    </Form.Group>
                                </Form>
                                <div className="text-center mt-3">
								<div className="text-center mt-3">
                                    {/* Sử dụng hình ảnh thay vì button */}
                                    <img 
                                        src={GoogleImg} 
                                        alt="Đăng nhập với Google"
                                        className="google-signin-img" // Có thể thêm class để chỉnh CSS nếu cần
                                        style={{ cursor: 'pointer', width: '40px', height: '40px' }}
                                        onClick={handleGoogleSignIn}
                                    />
                                </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="mb-0 text-white">
                                        Nếu chưa có tài khoản?{" "}
                                        <Link to="/sign-up" className="text-decoration-underline text-white">
                                            Đăng ký
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

export default SignInPage;
