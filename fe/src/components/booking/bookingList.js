import React from "react";
import { Badge, Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { customDate, customNumber } from "../../common/helper";
import { NotFoundPage } from "../common/notFound";
import { FormVoteModal } from "../form/formVote";
import { Pagination } from "../common/pagination";
import { BookingService } from "../../services/feService/bookingService";

export const BookingList = ( props ) =>
{

	const handleCancel = async (id) => {
		const response = await BookingService.cancel(id);
		console.log('------------- response: ', response);
		if (response?.status === 'success' || response?.status === 200) {
			props.getDataList( { ...props.params, page_size: props.paging.page_size, page: 1 } )
		} else {

		}
	}

	return (
		<React.Fragment>
			<section className={ `ftco-section ${ props.notShowTitle ? 'pt-0' : ' bg-light' }` }>
				<Container fluid>

					{ props.data?.length > 0 &&
						<Table responsive striped bordered hover>
							<thead>
								<tr>
									<th>#</th>
									<th>Customer</th>
									<th>Room</th>
									<th>Price</th>
									<th>Discount</th>
									<th>Total</th>
									<th className="text-nowrap">Check In</th>
									<th className="text-nowrap">Check Out</th>
									<th>Status</th>
									<th>Payment</th>
									<th>Created</th>
									<th>Action</th>

								</tr>
							</thead>
							<tbody>
								{
									props.data.map( ( item, key ) =>
									{
										return (
											<tr key={ item._id }>
												<td >{ key + 1 }</td>
												<td className="text-nowrap">
													<ul style={ { paddingLeft: 0, listStyleType: 'none' } }>
														<li>{ item.customer_name }</li>
														<li>{ item.customer_email }</li>
														<li>{ item.customer_phone }</li>
													</ul>
												</td>
												<td className="text-nowrap">
													<Link to={ '/room/' + item.room_id }>{ item.room?.name || '' }</Link>
												</td>
												<td className="text-nowrap">
													<span className={ 'text-success' }>{ customNumber( item.price, '.', ' đ' ) } </span>
												</td>
												<td className="text-nowrap">
													{ item.discount > 0 && (
														<span className={ 'text-danger' }>- { customNumber( item.discount, '.', ' đ' ) }</span>
													) }
												</td>
												<td className="text-nowrap">
													<span className={ 'text-success' }>{ customNumber( item.total_money, '.', ' đ' ) }</span>
												</td>
												<td className="text-nowrap">
													{ customDate( item.check_in, "DD-MM-YYYY" ) }
												</td>
												<td className="text-nowrap">
													{ customDate( item.check_out, "DD-MM-YYYY" ) }
												</td>
												<td>
													<Badge bg="success" text="white" className="p-2">{ item.status }</Badge>
												</td>
												<td>
													<Badge bg="warning" text="dark" className="p-2">{ item.status_payment }</Badge>
												</td>
												<td className="text-nowrap"	>
													{ customDate( item.created_at, "DD-MM-YYYY H:mm:ss" ) }
												</td>

												<td>
													{
														item?.status_payment?.toUpperCase() === 'PAID' &&
														<Button variant="success" size="sm" style={ { borderRadius: '10px' } } onClick={ e =>
														{
															props.setShowModal( true );
															props.setId( item.room_id );
														} }>
															Review
														</Button>
													}
													{
														 item?.status?.toUpperCase() != "CANCEL" &&
														<Button variant="danger" size="sm" style={ { borderRadius: '10px', marginLeft: "5px" } } onClick={() => handleCancel(item._id)}>
															Cancel
														</Button>
													}
												</td>
											</tr>
										)
									} )
								}
							</tbody>
						</Table>
						||
						<NotFoundPage />
					}
					<Row>
						{
							 props.paging.total > 0 &&
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
			<FormVoteModal { ...props } />
		</React.Fragment>
	);
};
