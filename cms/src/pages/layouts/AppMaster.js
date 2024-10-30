import { Link, Navigate, Route, Routes, useNavigate, useRoutes } from "react-router-dom";

import { AuthRoutes, routes } from "../../router/router";
import { Provider } from "react-redux";
import { store } from "../../store/Store";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/scss/style.scss";
import { checkLogin } from "../../services/common";
import React, { useEffect } from "react";
import { buildImage, DEFAULT_USER, getUser } from "../../common/common";

function AppMaster ()
{
	const routeConfig = useRoutes( routes() );
	const authRoutes = useRoutes( AuthRoutes );

	const navigate = useNavigate()
	useEffect( () =>
	{
		if ( !checkLogin() )
		{
			navigate( '/auth/login' );
		}
	}, [checkLogin()] )


	return (
		<Provider store={ store }>
			{
				checkLogin() ?
					<div className="mb-5">
						<Navbar expand="lg" className="bg-body-tertiary bg-primary mb-5">
							<Container>
								<Navbar.Brand>
									<Link to="/" className={ 'nav-link' }>Trang chủ</Link>
								</Navbar.Brand>
								<Navbar.Toggle aria-controls="basic-navbar-nav" />
								<Navbar.Collapse id="basic-navbar-nav">
									<Nav className="me-auto">
										<Link to="/booking" className={ 'nav-link' }>Quản lý đặt phòng</Link>
										<Link to="/category" className={ 'nav-link' }>Danh mục</Link>
										<Link to="/room" className={ 'nav-link' }>Phòng</Link>
										<Link to="/discount" className={ 'nav-link' }>Mã giảm giá</Link>
										<Link to="/service" className={ 'nav-link' }>Dịch Vụ</Link>
										<Link to="/menu" className={ 'nav-link' }>Menu</Link>
										<Link to="/article" className={ 'nav-link' }>Tin tức</Link>
										<Link to="/user" className={ 'nav-link' }>Thành viên</Link>
										<NavDropdown title="Phân quyền" id="basic-nav-dropdown">
											<Link to="/permission" className={ 'dropdown-item' }>Permission</Link>
											<Link to="/role" className={ 'dropdown-item' }>Role</Link>
											<Link to="/admin" className={ 'dropdown-item' }>Admin</Link>
										</NavDropdown>
									</Nav>
									<Nav className="d-flex">
										<img style={ { width: '50px', height: '50px', borderRadius: '50%' } } src={ getUser() && getUser().avatar && buildImage( getUser().avatar ) || DEFAULT_USER } />
										<NavDropdown title={ getUser()?.name } id="user-nav-dropdown" className="user-nav">
											<Link to="/account" className={ 'dropdown-item' }>Tài khoản</Link>
											<Link to='#' onClick={ () =>
											{
												localStorage.clear();
											} } className={ 'dropdown-item' }>Đăng xuất</Link>
										</NavDropdown>
									</Nav>

								</Navbar.Collapse>
							</Container>
						</Navbar>
						<ToastContainer />
						<div className={ 'my-5' }></div>
						{ routeConfig }
					</div>
					: authRoutes
			}

			<Routes>
				<Route
					path="/auth"
					element={ <Navigate to="/auth/login" replace /> }
				/>
			</Routes>
		</Provider>
	);
}

export default AppMaster;
