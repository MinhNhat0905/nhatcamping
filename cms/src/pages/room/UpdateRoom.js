import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import roomApi from "../../services/roomService";
import { toast } from "react-toastify";
import uploadApi from "../../services/uploadService";
import { URL_IMG } from "../../common/common";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageForm from '../../common/form/imageForm';
import categoryApi from "../../services/categoryService";
import facilityApi from '../../services/facilityService';
import { MapContainer, TileLayer, Marker, Popup,useMapEvents  } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export default function UpdateRoom ()
{
	const [ validated, setValidated ] = useState( false );
	const [ name, setName ] = useState( '' );
	const [ avatar, setAvatar ] = useState( '' );
	const [ price, setPrice ] = useState( '' );
	const [ size, setSize ] = useState( '' );
	const [ bed, setBed ] = useState( '' );
	const [ room_content, setRoomContent ] = useState( '' );
	const [ file, setFile ] = useState();
	const [room_code, setRoomCode] = useState('');
	const [floors, setFloors] = useState('');
	const [quantity, setQuantity] = useState('');
	const [address, setAddress] = useState('');
	const [ category_id, setCategoryId ] = useState( null );
	const [ categories, setCategories ] = useState( [] );
	const [facilities, setFacilities] = useState([]); // State để lưu tiện nghi
    const [selectedFacilities, setSelectedFacilities] = useState([]); // State cho tiện nghi được chọn
	const [location, setLocation] = useState(null);
	const navigate = useNavigate();
	const params = useParams();
	// Hàm để tự động xóa dấu âm
	const handlePositiveInput = (setter) => (event) => {
		const value = event.target.value;
		setter(value >= 0 ? value : Math.abs(value)); // Loại bỏ dấu âm nếu có
	};
	const [ fileAlbums, setFileAlbums ] = useState( [
		{
			imgBase64: null,
			file: null
		}
	] );

	const [ changes, setChanges ] = useState( false );
	// Component để xử lý sự kiện click
const ClickableMap = ({ location, setLocation }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            setLocation([lng, lat]); // Cập nhật tọa độ mới
        },
    });

    return null;
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
				address: address,
				quantity: quantity,
				room_code: room_code,
				category_id: category_id,
				facilities: selectedFacilities,
				location: location ? { type: "Point", coordinates: location } : null,
			}

			let activeAlbums = fileAlbums.filter(item => !item.file && item.imgBase64) || [];
			const resFile = await uploadApi.uploadFile( file );
			if ( resFile ) data.avatar = resFile;

			const albums = await uploadApi.uploadMultiImg( fileAlbums );
			let valueAlbums = [];
			if(activeAlbums.length > 0) {
				valueAlbums = activeAlbums.map(item => item.imgBase64);
			}
			console.log( '---------- AlbumUpload: ', valueAlbums );
			if ( albums.length > 0 ) data.albums = valueAlbums.concat(albums);
			else data.albums = valueAlbums

			const response = await roomApi.updateRoom( params.id, data );
			if ( response.status === 'success' || response.status === 200 )
			{
				toast( "Cập nhật thành công" );
				navigate( '/room' )
			} else
			{
				toast( response?.message || response?.error || 'error' );
			}console.log("Data before submit: ", data);
		}

		setValidated( true );
	};

	const handleChangeMenu = ( event ) =>
	{
		setCategoryId( event.target.value );
	};

	const findById = async ( id ) =>
	{
		const response = await roomApi.findById( id );
		console.log( '----------- response: ', response );
		if ( response.status === 'success' || response.status === 200 )
		{
			console.log( '---------- OK' );
			
			setName( response.data?.name );
			setAvatar( response.data?.avatar );
			setBed( response.data?.bed );
			setPrice(response.data?.price );
			setSize(response.data?.size );
			setFloors( response.data?.floors );
			setAddress(response.data?.address );
			setQuantity( response.data?.quantity );
			setCategoryId( response.data?.category_id );
			setRoomContent( response.data?.room_content );
			setSelectedFacilities(response.data?.facilities || []); // Lấy danh sách tiện nghi từ dữ liệu phòng
			 // Kiểm tra nếu location tồn tại và có coordinates
			 const roomLocation = response.data?.location;
			 if (roomLocation && roomLocation.coordinates) {
				 setLocation(roomLocation.coordinates);
			 } else {
				 setLocation(null); // Nếu không có tọa độ, đặt location là null
			 }
			if ( response?.data?.albums )
			{
				let files = response?.data?.albums.reduce( ( newValue, e ) =>
				{
					let obj = {
						imgBase64: e,
						file: null
					}
					newValue.push( obj );
					return newValue
				}, [] );
				files.push( {
					imgBase64: null,
					file: null
				} )
				setFileAlbums( files );
				setChanges( true )
			}
			setRoomCode( response.data?.room_code );
		} else
		{
			toast( response?.message || response?.error || 'error' );
		}
	}

// Tọa độ mặc định cho Hồ Chí Minh (latitude, longitude)
const defaultLocation = [10.8231, 106.6297]; // Hồ Chí Minh
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
	const handleFacilityChange = (facilityId) => {
        setSelectedFacilities((prevSelected) =>
            prevSelected.includes(facilityId)
                ? prevSelected.filter((id) => id !== facilityId)
                : [...prevSelected, facilityId]
        );
		
    };
	useEffect( () =>
	{
		// getDetailData();
		if ( params.id )
		{
			findById( params.id );
		}
		getListsMenu().then(r => {});
		getFacilitiesList();
	}, [ params.id ] );
	console.log("Selected Facilities: ", selectedFacilities);
	return (
		<div>
			<Container>
				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item href="/discount" >
								Phòng
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Cập nhật</Breadcrumb.Item>
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
										<Form.Control required type="number" min="0" name={'price'} placeholder="20000"
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
								<Col className={'col-2'}>
									<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
										<Form.Label>Số Phòng</Form.Label>
										<Form.Control required type="number" min="0" name={'room_code'} placeholder="801"
											onChange={handlePositiveInput(setRoomCode)}
											value={room_code} />
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
											<option value={ item._id } selected={ item._id === category_id ? true : false }>{ item.name }</option>
										)
									} ) }
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									Category không được để trống
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="mb-3" controlId="facilitySelect">
                                <Form.Label>Chọn tiện nghi</Form.Label>
                                <div>
                                    {facilities.map((facility) => (
                                        <Form.Check
                                            key={facility._id}
                                            type="checkbox"
                                            label={facility.name}
                                            value={facility._id}
                                            checked={selectedFacilities.includes(facility._id)}
                                            onChange={() => handleFacilityChange(facility._id)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
							<Form.Group controlId="formFile" className="mb-3">
								<Form.Label>Avatar</Form.Label>
								{ avatar && (
									<p style={ { marginTop: "10px" } } className='d-flex'>
										<img src={ URL_IMG + avatar } style={ { width: "100px", height: "auto" } } alt="" />
									</p>
								) }
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
							  {/* Hiển thị bản đồ */}
							  <MapContainer
									center={location ? [location[1], location[0]] : defaultLocation} // Trung tâm mặc định
									zoom={13}
									style={{ height: "400px", width: "100%" }}
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>
									{/* Hiển thị marker tại vị trí đã chọn */}
									{location && (
										<Marker position={[location[1], location[0]]}>
											<Popup>Vị trí hiện tại</Popup>
										</Marker>
									)}
									{/* Component để xử lý sự kiện click */}
									<ClickableMap location={location} setLocation={setLocation} />
								</MapContainer>
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
