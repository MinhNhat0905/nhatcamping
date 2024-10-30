import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import { Collapse, Container, NavDropdown, Nav, NavItem, Navbar } from 'react-bootstrap';
import { buildImage, checkLogin, getUser, onErrorUser, timeDelay } from "../../common/helper";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { menuService } from "../../services/feService/menuService";

export const NavBarPage = () =>
{

	//menu activation
	const [ menus, setMenus ] = useState( [] );
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const getMenus = async () =>
	{
		const response = await menuService.getDataList( {
			page: 1,
			page_size: 2
		} );

		if ( response.status === 200 )
		{
			setMenus( response.data.menus )
		}

	}

	useEffect( () =>
	{
		getMenus();
	}, [] );

	return (
		<React.Fragment>
			<Navbar
				className="navbar
				navbar-expand ftco-navbar-light navbar-dark"
			// id="ftco-navbar"
			>
				<Container>
					<Navbar.Brand>
						<Link to={ '/' } className={ 'navbar-brand' }>
							<img src={'/logo.png'} style={{ width: "100px"}} />
						</Link>
					</Navbar.Brand>

					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" >
						<Nav className="ml-auto justify-content-end">
							<Link className="nav-link" to="/">
								Trang chủ
							</Link>
							<Link className="nav-link" to="/room">
								Phòng
							</Link>
							{ menus && menus.length > 0 && menus.map( ( item, index ) =>
							{
								return (
									<Link to={ '/menu/' + item._id } key={ item._id } className="nav-link">
										{ item.name }
									</Link>
								)
							} ) }

							<Link className="nav-link" to="/contact">
								Liên hệ
							</Link>

							<Link className="nav-link" to="/service">
								Dịch vụ
							</Link>
						</Nav>
						<Nav className="navbar-light">
							{ !checkLogin() ?
								<NavDropdown title="Đăng nhập" id="basic-nav-dropdown">
									<Link to="/sign-up" className={ 'dropdown-item' }>
										Đăng ký
									</Link>
									<Link to="/sign-in" className={ 'dropdown-item' }>
										Đăng nhập
									</Link>
								</NavDropdown>
								: <>

									<NavDropdown title={ 'Hi, ' + getUser()?.name } id="user-nav-dropdown" className="user-nav">
										<Link to="/account" className={ 'dropdown-item' }>Tài khoản</Link>
										<Link to="/booking" className={ 'dropdown-item' }>Lịch sử đặt phòng</Link>
										<Link to='#' onClick={ async () =>
										{

											dispatch( toggleShowLoading( true ) )

											await timeDelay( 500 );
											localStorage.clear();
											window.location.href = '/'
											dispatch( toggleShowLoading( false ) )

										} } className={ 'dropdown-item' }>Đăng xuất</Link>
									</NavDropdown>
								</>
							}

						</Nav>


					</Navbar.Collapse>
				</Container>
			</Navbar>

		</React.Fragment>
	);
};

