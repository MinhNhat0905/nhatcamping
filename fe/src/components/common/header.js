import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, Link } from "react-router-dom";
import { NavBarPage } from "./navBar";
import img2 from "../../assets/images/bg_2.jpg";
import img1 from "../../assets/images/bg_1.jpg";
import { Carousel } from "react-bootstrap";
import { default1 } from "../../common/constant";

/* Layout */


const Header = ( props ) =>
{
	const [ name, setName ] = useState( null );
	useEffect( () =>
	{
		if ( props.title )
		{
			setName( props.title );
		} else
		{
			setName( null )
		}
	}, [ props.title ] );
	return (
		<React.Fragment>
			<NavBarPage />
			{ name !== null &&
				<div className="hero-wrap" style={ {
					backgroundImage: `url(${ default1 })`
				} }>
					<div className="overlay"></div>
					<div className="container">
						<div className="row no-gutters slider-text d-flex align-item-end justify-content-center">
							<div className="col-md-9 text-center d-flex align-items-end justify-content-center">
								<div className="text">
									<p className="breadcrumbs mb-2 ">
										<span className="mr-2">
											<Link className="fs-18" to="/">Home</Link>
										</span>
										{
											props.parents?.length > 0 &&
											props.parents.map( ( item, key ) =>
											{
												return <span key={key} className="mr-2">
													<Link className="fs-18" to={item.path}> / { item.title }</Link>
												</span>
											} )
										}
									</p>
									<h1 className="mb-4 bread">{ name }</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
			}

		</React.Fragment>
	);
};

export default Header;
