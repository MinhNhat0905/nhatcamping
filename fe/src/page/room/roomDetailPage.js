import React, { useEffect, useState } from "react";
import { DEFAULT_IMG } from "../../common/constant";
import { Button, Col, Container, Row } from "react-bootstrap";
import { RoomSideBar } from "../../components/room-service/roomSideBar";
import { RoomList } from "../../components/room-service/roomList";
import { RoomService } from "../../services/feService/roomService";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { URL_IMG, URL_IMG_V2, buildImage, buildImageV2, customNumber, onErrorImg } from "../../common/helper";
import { useNavigate, useParams } from "react-router";
import { StarIcons } from "../../components/common/star";
import { CarouselImg } from "../../components/common/carosel";
import { ReviewService } from "../../services/feService/reviewService";
import { Star, StarFill } from 'react-bootstrap-icons';
import { UserService } from '../../services/feService/UserService'; // Import UserService
import { facilityService } from '../../services/feService/facilityService';
import { MapContainer, TileLayer, Marker, Popup ,useMap } from "react-leaflet"; // Import Leaflet components
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Import Leaflet
//

const RoomDetailPage = () =>
{
	document.title = 'Chi tiết';

	const [ rooms, setRooms ] = useState( [] );
	const [ detailData, setDetailData ] = useState( null );
	const [ avgStar, setAvgStar ] = useState( 0 );

	const [ albums, setAlbums ] = useState( [] );
	const [ images, setImages ] = useState();
  	const [reviews, setReviews] = useState([]);
	  const [facilityDetails, setFacilityDetails] = useState([]);
	const [position, setPosition] = useState([null,null]); 
    
	useEffect(() => {
		if (detailData?.location?.coordinates) {
			const [lng, lat] = detailData.location.coordinates;
			setPosition([lat, lng]);
		}
	}, [detailData]);
	 // Sử dụng icon mặc định của Leaflet
	 const defaultIcon = new L.Icon.Default();
	// Hook để focus bản đồ vào tọa độ khi position thay đổi
	function LocationMarker() {
		const map = useMap();
	
		useEffect(() => {
		  if (position && position[0] !== null && position[1] !== null) {
			map.setView(position, 13);
		  }
		}, [position, map]);
	
		return (
		  <Marker position={position} icon={defaultIcon}>
			<Popup>Vị trí của phòng: {detailData?.address}</Popup>
		  </Marker>
		);
	  }
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate()
	useEffect( () =>
	{
		getRooms();
	}, [] );

	useEffect( () =>
	{
		if ( params.id )
		{
			getDetailData( params.id );
			getReviews(params.id);
			
		} else
		{
			setDetailData( null );
		}
	}, [ params.id ] );

	
	const getRooms = async () =>
	{
		const rs = await RoomService.getDataList( { page: 1, page_size: 6, status: 1 } );//page_size: 2 là số lượng phòng khác hiển thị
		if ( rs?.status === 200 )
		{
			setRooms( rs?.data?.rooms || [] )
		} else
		{
			setRooms( [] );
		}
	};
	const getReviews = async (roomId) => {
		try {
		  const response = await ReviewService.getDataList({ room_id: roomId, page: 1, page_size: 5 });
		  if (response?.status === 200) {
			const reviewsData = response?.data?.votes || [];
			setReviews(reviewsData); // Gán trực tiếp dữ liệu trả về vào state reviews
		  } else {
			setReviews([]); // Không có đánh giá
		  }
		} catch (error) {
		  console.error("Lỗi khi lấy danh sách đánh giá:", error);
		  setReviews([]); // Cập nhật state reviews nếu có lỗi
		}
	  };
	  
	  
	  const fetchFacilities = async (facilityIds) => {
		try {
			const facilitiesResponse = await facilityService.getFacilities({ id: facilityIds });
			setFacilityDetails(facilitiesResponse?.data || []);
		  } catch (error) {
			console.error("Lỗi khi lấy thông tin tiện nghi:", error);
			setFacilityDetails([]);
		  }
		};
	const getDetailData = async ( id ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await RoomService.getDetailData( id );
		console.log("thông tin phòng ",response);
		if ( response?.status === 200 )
		{
			let room = response.data;
			setDetailData(room);
      
      // Lọc và lấy danh sách tiện nghi chỉ của phòng này
      if (room?.facilities?.length > 0) {
        fetchFacilities(room.facilities); // Gọi hàm lọc tiện nghi
      }
			if ( room )
			{
				let totalVote = room.total_vote || 0;
				let totalStar = room.total_star || 0;
				if ( totalVote > 0 && totalStar > 0 )
				{
					setAvgStar( Math.round( totalStar / totalVote ) )
				}
			}
			let imgs = []
			if ( room.avatar )
			{
				imgs.push( {
					_id: room._id,
					avatar: room.avatar,
					class: 'h-50'
				} );
				setImages( room.avatar )
			}
			if ( room.albums?.length > 0 )
			{
				if ( !room.avatar ) setImages( room.albums[ 0 ] )
				for ( let item of room.albums )
				{
					imgs.push( {
						_id: room._id,
						avatar: item,
						class: 'h-50'
					} )
				}
			}
			setAlbums( imgs );
			setDetailData( response.data );
			// if (response.data.facilities?.length > 0) {
			// 	fetchFacilities(response.data.facilities);
			// }
		} else
		{
			setDetailData( null );
		}
		dispatch( toggleShowLoading( false ) );
	}//
	//
	return (
		<React.Fragment>
			<section className="ftco-section">
				<Container>
					<Row>
						<Col md={ 8 } className="py-3">
							{
								detailData && <Row>
									<Col md={ 12 }>
										<Row className="mb-5">
											<div className="w-md-50 w-100 col-md-6">
												<img
													src={ images && buildImageV2( images ) || DEFAULT_IMG }
													className="room-img mb-0 w-100 h-75 " onError={ onErrorImg } />
												{
													albums?.length > 0 &&
													<div className="d-flex mb-5 mt-2" style={{flexWrap: 'wrap'}}>
														{
															albums.map( ( item, key ) =>
															{

																if ( item )
																	return (
																		<img key={key}
																			src={ item.avatar && buildImageV2( item.avatar ) || DEFAULT_IMG }
																			onClick={e => {
																				setImages(item.avatar)
																			}}
																			className="mr-2 mb-1" style={{width: '80px', height: '80px'}} />
																	);
																return null;

															} )
														}
													</div>
												}
											</div>


											<div className="room-single col-md-6 w-md-50 w-100 d-flex flex-column justify-content-between">
												<div>
													<h2 className="mb-4">{ detailData.name } <StarIcons vote_number={ avgStar } /></h2>

													<p className="text-dark fs-20">Giá: <strong>{ customNumber( detailData.price, '.', 'đ' ) }</strong> </p>
													<div className="d-md-flex my-3">
														<ul className="list">
															<li><span>Diện tích:</span> { detailData.size } m2</li>
														</ul>
														<ul className="list ml-md-5">
															<li><span>Số phòng ngủ:</span> { detailData.bed }</li>
														</ul>
													</div>
													<div className="d-md-flex my-3">
														<ul className="list ml-md-0">
															<li><span>Địa chỉ:</span> { detailData.address }</li>
														</ul>
													</div>
														
												</div>
												<div className="fields">
													<button className="btn btn-primary py-3 px-5" style={ { borderRadius: '5px' } } onClick={ () =>
													{
														navigate( '/booking/create/' + detailData._id )
													} }>
														Đặt phòng
													</button>
												</div>


											</div>
										</Row>

									</Col>
									<Col md={12} className="room-single mt-4 mb-5">
										<h3>Thông tin</h3>
										<p className="mb-0" dangerouslySetInnerHTML={{ __html: detailData.room_content }}></p>

										{/* Phần tiện nghi phòng */}
										
									</Col>
									<Col md={12} className="mt-4">
    <h4>Tiện nghi</h4>
   {facilityDetails?.facilities?.length > 0 ? (
    <ul className="facility-list">
        {facilityDetails.facilities.map((facility) => (
            <li key={facility._id}>
                <i className="fa fa-check-circle text-success mr-2"></i>
                {facility.name || "Tên tiện nghi không xác định"}
            </li>
        ))}
    </ul>
) : (
    <p>Không có thông tin tiện nghi</p>
)}

</Col>
{/* Hiển thị bản đồ bên dưới phần thông tin */}
<Col md={12} className="room-single mb-5 mt-5">
{position && position[0] && position[1] ? (
    <div className="room-map mt-5">
        <h4 className="mb-4">Vị trí trên bản đồ</h4>
		<MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {position && position[0] !== null && position[1] !== null && <LocationMarker />}
      </MapContainer>
    </div>
) : (
    <p>Không có thông tin vị trí để hiển thị bản đồ.</p> // Hiển thị fallback nếu không có tọa độ
)}
                                </Col>
									<Col md={12} className="room-single mb-5 mt-5">
										<h4 className="mb-4">Đánh giá của mọi người</h4>
										{reviews.length > 0 ? (
											<div>
											{reviews.map((review, index) => (
												<div key={index} className="review-item">
												<h5>{review.user_name}</h5> {/* Hiển thị tên người dùng */}
												<div className="review-stars">
													{[...Array(review.vote_number)].map((_, idx) => (
													<StarFill key={idx} style={{ color: 'gold' }} className="star active" />
													))}
													{[...Array(5 - review.vote_number)].map((_, idx) => (
													<Star key={idx} className="star" />
													))}
												</div>
												<p>{review.vote_content}</p>
												</div>
											))}
											</div>
										) : (
											<p>Chưa có đánh giá nào.</p>
										)}
									</Col>
									<Col md={ 12 } className="room-single  mb-5 mt-5">
										<h4 className="mb-4">Các phòng khác</h4>
										<RoomList data={ rooms } notShowTitle={ true } lg={ 6 } />
									</Col>
								</Row>
							}
						</Col>

						{/* Side bar */ }
						<Col md={ 4 } className="sidebar">
							<RoomSideBar detailData={ detailData } />
						</Col>
					</Row>
				</Container>
			</section>
		</React.Fragment>
	);
};

export default RoomDetailPage;