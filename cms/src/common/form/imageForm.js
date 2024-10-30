

import { Link, Navigate, Route, Routes, useNavigate, useRoutes } from "react-router-dom";

import { AuthRoutes, routes } from "../../router/router";
import { Provider } from "react-redux";
import { store } from "../../store/Store";
import { Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../../assets/scss/style.scss";
import { checkLogin } from "../../services/common";
import React, { useEffect, useState } from "react";
import { buildImage, DEFAULT_USER, getUser, onErrorImg, readFile, readFileImg, URL_IMG } from "../../common/common";
import { CloseOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";

export default function ImageForm ( props )
{
	const openFile = ( item, index ) =>
	{
		{
			let imgFile = document.getElementById( 'image_' + index );
			if ( imgFile )
			{
				imgFile.click();
				props.setChanges( false );
			}
		}
	}

	const [ changes, setChanges ] = useState( false );



	const [ images, setImages ] = useState( props.files );

	useEffect( () =>
	{
		if ( props.changes )
		{
			setImages( props.files )
		}
	}, [ props.changes ] );
	return (
		<div className="d-flex">
			{
				images?.length > 0 && images.map( ( item, index ) =>
				{
					return (
						<div className='plus-image mr-5' key={ index } onClick={ e =>
						{
							if ( !item.imgBase64 )
							{

								openFile( item, index )
							} else
							{
								let imgFile = document.getElementById( 'close_' + index );
								if ( imgFile )
								{
									imgFile.click();
								}
							}
						} }>
							{
								item.imgBase64 ?
									<>
										<img src={ item.file ? item.imgBase64 : URL_IMG +  item.imgBase64} onError={ onErrorImg }
											className="avatar cursor-pointer mr-2" />
										<div className="delete-image">
											<CloseOutlined id={ 'close_' + index } onClick={ e =>
											{
												if ( images.length > 1 )
												{
													let a = images
													item = {
														imgBase64: null,
														file: null
													}
													props.setFiles( a );
													setImages(a)
													setChanges( true )
												} else
												{
													props.setFiles( [ {
														imgBase64: null,
														file: null
													} ] );
													setImages([ {
														imgBase64: null,
														file: null
													} ])
													setChanges( true )
												}

											} } />
										</div>
									</> : <PlusOutlined />

							}
							<Form.Control id={ 'image_' + index } type="file" accept="image/*"
								className="d-none" onChange={ e =>
								{
									e.stopPropagation();
									if ( e?.target?.files && e?.target?.files[ 0 ] )
									{
										images[ index ].imgBase64 = URL.createObjectURL( e?.target?.files[ 0 ] );
										images[ index ].file = e?.target?.files[ 0 ];
										if(!images[index + 1] && images.length < props.max) {
											images.push( {
												imgBase64: null,
												file: null
											} );
										}
										
										props.setFiles( images );
										setImages( images );
										props.setChanges( true )
									}
								} } />
						</div >
					)
				} )
			}

		</div>

	);
}
