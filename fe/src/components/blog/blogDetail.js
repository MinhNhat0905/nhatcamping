import React, { useEffect, useState } from "react";
import { DEFAULT_IMG } from "../../common/constant";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toggleShowLoading } from "../../redux/actions/common";
import { buildImage, customNumber, onErrorImg } from "../../common/helper";
import { useParams } from "react-router";
import { ArticleService } from "../../services/feService/articleService";
import { BlogList } from "./blogList";
import { menuService } from "../../services/feService/menuService";

export const BlogDetail = () =>
{
	document.title = 'Chi tiết';

	const [ data, setData ] = useState( [] );
	const [ detailData, setDetailData ] = useState( null );
	const [ menuDetail, setMenuDetail ] = useState( null );


	const dispatch = useDispatch();
	const params = useParams();

	useEffect( () =>
	{

	} )
	useEffect( () =>
	{
		if ( menuDetail )
		{
			getDataList( { page: 1, page_size: 4, menu_id: menuDetail._id } )

		} else
		{
			getDataList( { page: 1, page_size: 4, } )
		}
	}, [ menuDetail ] )
	useEffect( () =>
	{
		if ( params.id )
		{
			getDetailData( params.id )
		} else
		{
			setDetailData( null );
		}
	}, [ params.id ] );

	const getDataList = async ( params ) =>
	{

		const rs = await ArticleService.getDataList( params );
		if ( rs?.status === 200 )
		{

			setData( rs?.data?.articles || [] );
		} else
		{
			setData( [] );
		}
		dispatch( toggleShowLoading( false ) );
	};

	const getDetailData = async ( id ) =>
	{
		dispatch( toggleShowLoading( true ) );
		const response = await ArticleService.getDetailData( id );
		if ( response?.status === 200 )
		{
			setDetailData( response.data );
			if ( response.data?.menu_id )
			{
				await getDetailMenu( response.data?.menu_id );

			}

		} else
		{
			setDetailData( null );
		}
		dispatch( toggleShowLoading( false ) );
	}

	const getDetailMenu = async ( id ) =>
	{
		const response = await menuService.getDetailData( id );
		if ( response?.status === 200 )
		{
			setMenuDetail( response?.data );
		}
	}
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


								<p className="mb-0" dangerouslySetInnerHTML={ { __html: detailData.article_content } }>
									{/* {  } */ }
								</p>

							</Col>
						}

						{/* Side bar */ }
						<Col md={ 12 } className="mt-5">

							<BlogList data={ data } title={ menuDetail?.name || 'Relate Menu' } />
						</Col>
					</Row>
				</Container>
			</section>
		</React.Fragment>
	);
};
