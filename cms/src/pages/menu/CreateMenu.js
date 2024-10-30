import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import menuApi from '../../services/menuService';
import { useNavigate } from 'react-router-dom';

export default function CreateMenu ()
{

	const [ validated, setValidated ] = useState( false );
	const [ name, setName ] = useState( '' );

	const navigate = useNavigate();
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
				name: name,
			}

			const response = await menuApi.create( data );
			if ( response?.status === 'success' || response?.status === 200 )
			{
				toast( "Thêm mới thành công" );
				navigate( '/menu' )
			} else
			{
				toast( response?.message || response?.error || 'error' );
			}
		}

		setValidated( true );
	};

	return (
		<div>
			<Container>
				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item href="/menu" >
								Tin tức
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
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
