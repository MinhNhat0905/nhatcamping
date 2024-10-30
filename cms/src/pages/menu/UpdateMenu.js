import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";

import { Link, useNavigate, useParams } from "react-router-dom";
import menuApi from "../../services/menuService";
import { toast } from "react-toastify";

export default function UpdateMenu ()
{
	const [ validated, setValidated ] = useState( false );
	const [ name, setName ] = useState( '' );

	const navigate = useNavigate();
	const params = useParams();
	const handleSubmit = async ( event ) =>
	{
		event.preventDefault();
		const form = event.currentTarget;
		if ( form.checkValidity() === false )
		{
			event.stopPropagation();
		} else
		{
			let data = {
				name: name
			}

			const response = await menuApi.update( params.id, data );
			if ( response.status === 'success' || response.status === 200 )
			{
				toast( "Cập nhật thành công" );
				navigate( '/menu' )
			} else
			{
				toast( response?.message || response?.error || 'error' );
			}
		}

		setValidated( true );
	};

	const findById = async ( id ) =>
	{
		const response = await menuApi.findById( id );
		if ( response.status === 'success' || response.status === 200 )
		{
			setName( response.data.name );
		} else
		{
			toast( response?.message || response?.error || 'error' );
		}
	}

	useEffect( () =>
	{
		if ( params.id )
		{
			findById( params.id );
		}
	}, [ params.id ] );

	return (
		<div>
			<Container>
				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item href="/menu" >
								Tin tức
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Cập nhật</Breadcrumb.Item>
						</Breadcrumb>
						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/menu' } >Trở về</Link>
						</div>
						<Form noValidate validated={ validated } onSubmit={ handleSubmit }>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Tên menu</Form.Label>
								<Form.Control required type="text" name={ 'name' } placeholder="Bài viết"
											  onChange={ event => setName( event.target.value ) }
											  value={ name } />
								<Form.Control.Feedback type="invalid">
									Tên menu không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Button type="submit">Lưu dữ liệu</Button>
							</Form.Group>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	);
}
