import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DEFAULT_IMG, STATIC_URL_IMAGE } from "../../common/constant";
import { buildImage, customNumber, onErrorImg } from "../../common/helper";
import { ArrowRight } from 'react-bootstrap-icons';
import { StarIcons } from "../common/star";
import { Pagination } from "../common/pagination";
import { FormRoomSearch } from "../form/formSearchRoom";
import { NotFoundPage } from "../common/notFound";

export const RoomList = ( props ) =>
{
	return (
		<React.Fragment>
			<section className={ `ftco-section ${ props.notShowTitle ? '' : ' bg-light' }` }>
				<Container>
					{
						!props.notShowTitle && <Row className="row justify-content-center mb-5 pb-3">
							<Col md={ 7 } className="heading-section text-center">
								<h2 className="mb-4">Our Rooms</h2>
							</Col>
						</Row>
					}

					<Row>
						{
							!props.isShowLink && !props.notShowTitle && <Col md={ 3 }>
								<Card className="mb-5 p-3 br-6">
									<FormRoomSearch
										{ ...props }
									/>
								</Card>
							</Col>
						}
						<Col md={!props.isShowLink && !props.notShowTitle ? 9 : 12}>
							<Row>
								{
									props.data && props.data.map( ( item, key ) =>
									{
										let totalVote = item.total_vote || 0;
										let totalStar = item.total_star || 0;
										let avgStar = 0;
										if ( totalVote > 0 && totalStar > 0 )
										{
											avgStar = Math.round( totalStar / totalVote );
										}
										return (
											<Col lg={ props.size || 4 } md={props.size || 4 } key={ key }>
												<div className="room">
													<Link to={ '/room/' + item._id } className="img d-flex justify-content-center align-items-center br-top-left-6 br-top-right-6"
													>
														<img src={ item.avatar && buildImage( item.avatar ) || DEFAULT_IMG } className="w-100 h-100 br-top-left-6 br-top-right-6" onError={ onErrorImg } />

													</Link>
													<div className="text p-3 text-center br-bottom-left-6 br-bottom-right-6">
														<h3 className="mb-3">
															<Link to={ '/room/' + item._id }>{ item.name }</Link>
															<StarIcons vote_number={ avgStar } />
														</h3>
														<p>
															<span className="price mr-2">{ customNumber( item.price, '.', 'đ' ) }</span>
															<span className="per">per night</span>
														</p>
														<hr />
														<p className="pt-1">
															<Link to={ '/room/' + item._id } className="btn-custom">
																View Room Details
																<span className="icon-long-arrow-right"></span>
															</Link>
														</p>
													</div>
												</div>
											</Col>
										)
									} )
								}
								{
									!props.isShowLink && !props.notShowTitle &&
									<Col md={ 12 }>
										{
											props.paging.total > 0 ?
												< Pagination
													total={ props.paging.total }
													page={ props.paging.current_page }
													pageSize={ props.paging.page_size }
													onPageChange={ ( e ) =>
													{
														props.getDataList( { ...props.params, page_size: props.paging.page_size, page: e } )
													} }
												/> : <NotFoundPage />
										}


									</Col>
								}
								{
									!props.isShowLink
								}
								{
									props.isShowLink &&
									<Col md={ 12 }>
										<div className="mt-3 text-center">
											<Link
												to="/room"
												className="btn btn-primary btn-hover fs-18"
											>
												View All <ArrowRight />
											</Link>
										</div>
									</Col>
								}
							</Row>
						</Col>


					</Row>

				</Container>
			</section>
		</React.Fragment>
	);
};
