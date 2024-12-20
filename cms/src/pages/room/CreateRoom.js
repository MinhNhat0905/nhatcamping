
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
import facilityApi from '../../services/facilityService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Đặt cấu hình icon Leaflet để tránh lỗi
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
function LocationSelector({ location, setLocation }) {
	const MapEvents = () => {
	  useMapEvents({
		click(e) {
		  setLocation(e.latlng); // Cập nhật tọa độ khi người dùng click
		},
	  });
	  return null;
	};
  
	return (
	  <MapContainer center={[10.7769, 106.7009]} zoom={13} style={{ height: '400px', width: '100%' }}>
		<TileLayer
		  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		/>
		<MapEvents />
		{location && <Marker position={[location.lat, location.lng]} />}
	  </MapContainer>
	);
  }
export default function CreateRoom ()
{
	const [location, setLocation] = useState(null);
	const [ validated, setValidated ] = useState( false );
	const [ name, setName ] = useState( '' );
	const [ avatar, setAvatar ] = useState( '' );
	const [ price, setPrice ] = useState( '' );
	const [ size, setSize ] = useState( '' );
	const [ bed, setBed ] = useState( '' );
	const [ room_content, setRoomContent ] = useState( '' );
	const [ file, setFile ] = useState();
	const [floors, setFloors] = useState('');
	const [address, setAddress] = useState('');
	const [quantity, setQuantity] = useState('');
    const [room_code, setRoomCode] = useState('');

	const [ category_id, setCategoryId ] = useState( null );
	const [ categories, setCategories ] = useState( [] );
	const [facilities, setFacilities] = useState([]); // Danh sách tiện nghi từ API
    const [selectedFacilities, setSelectedFacilities] = useState([]); // Danh sách các tiện nghi được chọn

	const [ fileAlbums, setFileAlbums ] = useState( [
		{
			imgBase64: null,
			file: null
		}
	] );

	const [ changes, setChanges ] = useState( false );
	const params = useParams();
	const navigate = useNavigate();
	// Hàm để tự động xóa dấu âm
	const handlePositiveInput = (setter) => (event) => {
		const value = event.target.value;
		setter(value >= 0 ? value : Math.abs(value)); // Loại bỏ dấu âm nếu có
	};

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
				quantity: quantity,
				address: address,
                room_code: room_code,
				category_id: category_id,
				facilities: selectedFacilities,
				location: location,
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
			}console.log("Data before submit: ", data);
		}
		console.log(selectedFacilities);
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
	const getFacilitiesList = async () => {
        const response = await facilityApi.getLists({ page_size: 1000 }); 
		console.log(response); // Xem dữ liệu trả về
        if (response?.status === 'success' || response?.status === 200) {
            setFacilities(response.data.facilities);
        }
    };
	const handleChangeMenu = ( event ) =>
	{
		setCategoryId( event.target.value );
	}
	const handleFacilityChange = (facilityId) => {
		setSelectedFacilities((prevSelected) =>
			prevSelected.includes(facilityId)
				? prevSelected.filter((id) => id !== facilityId) // Xóa tiện nghi nếu đã chọn
				: [...prevSelected, facilityId] // Thêm tiện nghi nếu chưa chọn
		);
		console.log("Selected Facilities: ", selectedFacilities);
	};
	useEffect( () =>
	{
		getListsMenu( { ...params } ).then( r => { } );
		getFacilitiesList();
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
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label>Địa chỉ</Form.Label>
								<Form.Control required type="text" name={ 'address' } placeholder="Da lat"
									onChange={ event => setAddress( event.target.value ) }
									value={ address } />
								<Form.Control.Feedback type="invalid">
									Địa chỉ không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Row>
								<Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Giá phòng</Form.Label>
										<Form.Control required type="number" min="0" name={'price'} placeholder="200000"
											onChange={handlePositiveInput(setPrice)}
											value={price} />
										<Form.Control.Feedback type="invalid">
											Giá phòng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Diện tích</Form.Label>
										<Form.Control required type="number" min="0" name={'size'} placeholder="40"
											onChange={handlePositiveInput(setSize)}
											value={size} />
										<Form.Control.Feedback type="invalid">
											Diện tích không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								<Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Số phòng ngủ</Form.Label>
										<Form.Control required type="number" min="0" name={'bed'} placeholder="4"
											onChange={handlePositiveInput(setBed)}
											value={bed} />
										<Form.Control.Feedback type="invalid">
											Số phòng ngủ không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col>
								{/* <Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Số lượng</Form.Label>
										<Form.Control required type="number" min="0" name={'quantity'} placeholder="8"
											onChange={handlePositiveInput(setQuantity)}
											value={quantity} />
										<Form.Control.Feedback type="invalid">
											Số lượng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col> */}
								
								{/* <Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Tầng</Form.Label>
										<Form.Control required type="number" min="0" name={'floors'} placeholder="8"
											onChange={handlePositiveInput(setFloors)}
											value={floors} />
										<Form.Control.Feedback type="invalid">
											Tầng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col> */}
								{/* <Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Số Phòng</Form.Label>
										<Form.Control required type="number" min="0" name={'room_code'} placeholder="801"
											onChange={handlePositiveInput(setRoomCode)}
											value={room_code} />
										<Form.Control.Feedback type="invalid">
											Số phòng không được để trống
										</Form.Control.Feedback>
									</Form.Group>
								</Col> */}
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
							<Form.Group className="mb-3" controlId="facilitySelect">
                                <Form.Label>Chọn tiện nghi</Form.Label>
								{facilities.map((facility) => (
									<Form.Check
										key={facility._id}
										type="checkbox"
										label={facility.name}
										value={facility._id}
										checked={selectedFacilities.includes(facility._id)} // Kiểm tra xem tiện nghi có được chọn không
										onChange={() => handleFacilityChange(facility._id)} // Cập nhật khi chọn
									/>
								))}
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
							<Form.Group className="mb-3" controlId="locationSelector">
                <Form.Label>Chọn vị trí trên bản đồ</Form.Label>
                <LocationSelector location={location} setLocation={setLocation} />
                {location && (
                  <div className="mt-2">
                    <strong>Tọa độ:</strong> {location.lat}, {location.lng}
                  </div>
                )}
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