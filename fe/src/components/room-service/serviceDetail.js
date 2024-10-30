import React, { useEffect, useState } from "react";
import { DEFAULT_IMG } from "../../common/constant";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { buildImage, customNumber, onErrorImg } from "../../common/helper";
import { useParams } from "react-router";
import { ArticleService } from "../../services/feService/articleService";
import { ServiceHotelService } from "../../services/feService/serviceHotel";
import { ServiceList } from "./serviceList";

export const ServiceDetail = () =>
{
	document.title = 'Chi tiết dịch vụ';

	const [ data, setData ] = useState( [] );
	const [ detailData, setDetailData ] = useState( null );


	const dispatch = useDispatch();
	const { id } = useParams();

	useEffect( () =>
	{
		if ( id )
		{
			getDetailData( id )
		} else
		{
			setDetailData( null );
		}
	}, [ id ] );

	useEffect( () =>
	{
		getDataList( { page: 1, page_size: 4 } )
	}, [] )



	const getDetailData = async ( id ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await ServiceHotelService.getDetailData( id );
		if ( response?.status === 200 )
		{
			setDetailData( response.data );

		} else
		{
			setDetailData( null );
		}
		dispatch( toggleShowLoading( false ) );
	}

	const getDataList = async ( params ) =>
	{

		const rs = await ServiceHotelService.getDataList( params );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.services || [] );
		} else
		{
			setData( [] );
		}
	};
	return (
		<React.Fragment>
			<section className="ftco-section ftc-no-pb ftc-no-pt">
				<Container>
					<Row>
						
						{
							detailData && <Col md={ 12 } className="py-3">
								<div className="heading-section heading-section-wo-line pt-md-4">
									<h2 className="ml-md-0 text-center">
										{ detailData.name }
									</h2>
									<p>
										{ detailData.description }
									</p>
								</div>
								<div className="d-flex justify-content-center my-5 align-items-center">
									<img
										src={ detailData.avatar && buildImage( detailData.avatar ) || DEFAULT_IMG }
										className="room-img " onError={ onErrorImg } />
								</div>


								<p className="mb-0" dangerouslySetInnerHTML={ { __html: detailData.service_content } }>
								</p>

							</Col>
						}
						{
							data?.length > 0 && <ServiceList data={ data } title="Dịch vụ khác" />
						}
					</Row>
				</Container>
			</section>
		</React.Fragment>
	);
};
