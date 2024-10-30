import React, {useEffect, useRef, useState} from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {Link, useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import roomApi from '../../services/roomService';
import uploadApi from "../../services/uploadService";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DEFAULT_IMG, onErrorImg, readFile } from '../../common/common';
import { CloseOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import ImageForm from '../../common/form/imageForm';
import categoryApi from "../../services/categoryService";

export default function CreateRoom ()
{
	const [ validated, setValidated ] = useState( false );
	const [ name, setName ] = useState( '' );
	const [ avatar, setAvatar ] = useState( '' );
	const [ price, setPrice ] = useState( '' );
	const [ size, setSize ] = useState( '' );
	const [ bed, setBed ] = useState( '' );
	const [ room_content, setRoomContent ] = useState( '' );
	const [ file, setFile ] = useState();
	const [floors, setFloors] = useState('');
    const [room_code, setRoomCode] = useState('');

	const [ category_id, setCategoryId ] = useState( null );
	const [ categories, setCategories ] = useState( [] );

	const [ fileAlbums, setFileAlbums ] = useState( [
		{
			imgBase64: null,
			file: null
		}
	] );

	const [ changes, setChanges ] = useState( false );
	const params = useParams();
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
				avatar: null,
				price: price,
				bed: bed,
				size: size,
				room_content: room_content,
				floors: floors,
                room_code: room_code,
				category_id: category_id,
			}

			const avatarUpload = await uploadApi.uploadFile( file );
			const albums = await uploadApi.uploadMultiImg( fileAlbums );
			console.log( '---------- avatarUpload: ', avatarUpload );
			console.log( '---------- AlbumUpload: ', albums );
			if ( avatarUpload ) data.avatar = avatarUpload;
			if ( albums.length > 0 ) data.albums = albums;
			console.log( '------- data: ', data );

			const response = await roomApi.createRoom( data );
			if ( response.status === 'success' || response.status === 200 )
			{
				toast( "Thêm mới thành công" );
				navigate( '/room' )
			} else
			{
				toast( response?.message || response?.error || 'error' );
			}
		}

		setValidated( true );
	};

	const handleUpload = ( event ) =>
	{
		if ( event && event.target.files[ 0 ] ) setFile( event.target.files[ 0 ] );
	}
	const getListsMenu = async () =>
	{
		const response = await categoryApi.getLists( {
			page_size: 1000
		} )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			setCategories( response.data.categories );
		}
	}

	const handleChangeMenu = ( event ) =>
	{
		setCategoryId( event.target.value );
	}

	useEffect( () =>
	{
		getListsMenu( { ...params } ).then( r => { } );
	}, [ ] );



	return (
		<div>
			<Container>
				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item href="/article" >
								Phòng
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
						</Breadcrumb>
						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/room' } >Trở về</Link>
						</div>
						<Form noValidate validated={ validated } onSubmit={ handleSubmit }>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Tên phòng</Form.Label>
								<Form.Control required type="text" name={ 'name' } placeholder="Suite Room"
									onChange={ event => setName( event.target.value ) }
									value={ name } />
								<Form.Control.Feedback type="invalid">
									Tên phòng không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Row>
								<Col className={ 'col-2' }>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Giá phòng</Form.Label>
										<Form.Control required type="text" name={ 'price' } placeholder="20000"
											onChange={ event => setPrice( event.target.value ) }
											value={ price } />
										<Form.Control.Feedback type="invalid">
											Giá phòng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col className={ 'col-2' }>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Diện tích</Form.Label>
										<Form.Control required type="text" name={ 'size' } placeholder="40"
											onChange={ event => setSize( event.target.value ) }
											value={ size } />
										<Form.Control.Feedback type="invalid">
											Diện tích không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col className={ 'col-2' }>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Số phòng ngủ</Form.Label>
										<Form.Control required type="text" name={ 'bed' } placeholder="4"
											onChange={ event => setBed( event.target.value ) }
											value={ bed } />
										<Form.Control.Feedback type="invalid">
											Số phòng ngủ không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col className={ 'col-2' }>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Tầng</Form.Label>
										<Form.Control required type="text" name={ 'floors' } placeholder="8"
											onChange={ event => setFloors( event.target.value ) }
											value={ floors } />
										<Form.Control.Feedback type="invalid">
											Tầng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col className={ 'col-2' }>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Số Phòng</Form.Label>
										<Form.Control required type="text" name={ 'room_code' } placeholder="801"
											onChange={ event => setRoomCode( event.target.value ) }
											value={ room_code } />
										<Form.Control.Feedback type="invalid">
											Số phòng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
							</Row>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Category</Form.Label>
								<Form.Select required aria-label="Default select example" onChange={ handleChangeMenu }>
									<option value="">-- Mời chọn category --</option>
									{ categories.map( ( item, index ) =>
									{
										return (
											<option value={ item._id } selected={ item._id == category_id ? true : false }>{ item.name }</option>
										)
									} ) }
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									Category không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group controlId="formFile" className="mb-3">
								<Form.Label>Avatar</Form.Label>
								<Form.Control type="file" accept="image/*" onChange={ ( event ) => handleUpload( event ) } />

							</Form.Group>
							<Form.Group className="mb-3 ">
								<Form.Label>
									Ảnh chi tiết:
								</Form.Label>
								<ImageForm files={ fileAlbums } changes={ changes } setChanges={ setChanges } setFiles={ setFileAlbums } max={ 5 } />

							</Form.Group >
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Form.Label>Nội dung</Form.Label>
								<CKEditor
									editor={ ClassicEditor }
									data={ room_content }
									onChange={ ( event, editor ) =>
									{
										setRoomContent( editor?.getData() || '' )
									} }

									onBlur={ ( event, editor ) =>
									{
										setRoomContent( editor?.getData() || '' )
									} }
								/>
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Button type="submit">Lưu dữ liệu</Button>
							</Form.Group>
						</Form >
					</Col >
				</Row >
			</Container >
		</div >
	);
}
