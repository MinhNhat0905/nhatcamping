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

const RoomDetailPage = () =>
{
	document.title = 'Chi tiết';

	const [ rooms, setRooms ] = useState( [] );
	const [ detailData, setDetailData ] = useState( null );
	const [ avgStar, setAvgStar ] = useState( 0 );

	const [ albums, setAlbums ] = useState( [] );
	const [ images, setImages ] = useState();



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
			getDetailData( params.id )
		} else
		{
			setDetailData( null );
		}
	}, [ params.id ] )

	const getRooms = async () =>
	{
		const rs = await RoomService.getDataList( { page: 1, page_size: 2, status: 1 } );
		if ( rs?.status === 200 )
		{
			setRooms( rs?.data?.rooms || [] )
		} else
		{
			setRooms( [] );
		}
	};

	const getDetailData = async ( id ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await RoomService.getDetailData( id );
		if ( response?.status === 200 )
		{
			let room = response.data;
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
		} else
		{
			setDetailData( null );
		}
		dispatch( toggleShowLoading( false ) );
	}
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
															<li><span>Size:</span> { detailData.size } m2</li>
														</ul>
														<ul className="list ml-md-5">
															<li><span>Bed:</span> { detailData.bed }</li>
														</ul>
													</div>
												</div>
												<div className="fields">
													<button className="btn btn-primary py-3 px-5" style={ { borderRadius: '5px' } } onClick={ () =>
													{
														navigate( '/booking/create/' + detailData._id )
													} }>
														Book
													</button>
												</div>


											</div>
										</Row>

									</Col>
									<Col md={ 12 } className="room-single mt-4 mb-5 ">
										<h3>Mô tả ngắn</h3>
										<p>
											{ detailData.description }

										</p>
										<h3>Nội dung</h3>
										<p className="mb-0" dangerouslySetInnerHTML={ { __html: detailData.room_content } }>
										</p>
									</Col>
									<Col md={ 12 } className="room-single  mb-5 mt-5">
										<h4 className="mb-4">Available Room</h4>
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
