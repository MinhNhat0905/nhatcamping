import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DEFAULT_IMG, STATIC_URL_IMAGE } from "../../common/constant";
import { buildImage, customNumber, onErrorImg } from "../../common/helper";
import { Pagination } from "../common/pagination";

export const ServiceList = ( props ) =>
{
	return (
		<React.Fragment>
			<section className="ftco-section bg-light">
				<Container>
					<Row className="row justify-content-center mb-5 pb-3">
						<Col md={ 7 } className="heading-section text-center">
							<h2 className="mb-4">{props?.title || 'Our Services'}</h2>
						</Col>
					</Row>
					<Row>
						{
							props.data && props.data.map( ( item, key ) =>
							{
								return (
									<Col lg={ 3 } md={ 6 } key={ key }>
										<div className="room">
											<Link to={'/service/' + item._id} className="img d-flex justify-content-center align-items-center "
											>
												<img src={ item.avatar && buildImage( item.avatar ) || DEFAULT_IMG }
													className="w-100 h-100 br-top-left-6 br-top-right-6" onError={ onErrorImg } />

											</Link>
											<div className="text p-3 text-center br-bottom-left-6 br-bottom-right-6">
												<h3 className="mb-3">
													<Link to={'/service/' + item._id}>{ item.name }</Link>
												</h3>

											</div>
										</div>
									</Col>
								)
							} )
						}
						{
							 props?.paging?.total > 0 &&
							<Col md={ 12 }>
								< Pagination
									total={ props.paging.total }
									page={ props.paging.current_page }
									pageSize={ props.paging.page_size }
									onPageChange={ ( e ) =>
									{
										props.getDataList( { ...props.params, page_size: props.paging.page_size, page: e } )
									} }
								/>
							</Col>
						}
					</Row>
				</Container>
			</section>
		</React.Fragment>
	);
};
