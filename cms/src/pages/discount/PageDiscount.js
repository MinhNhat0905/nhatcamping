import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from "react-bootstrap"

import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import discountApi from '../../services/discountService';
import { toast } from 'react-toastify';
import moment from "moment";
import currencyFormat from "../../common/common";
import { Pagination } from '../../common/form/pagination';

export default function PageDiscount ()
{

	const [ paging, setPaging ] = useState( {
		current_page: 1,
		page_size: 20,
		total: 0,
		total_page: 0,
	} );

	const [ params, setParams ] = useState( {

	} );

	const [ discounts, setDiscounts ] = useState( [] );

	useEffect( () =>
	{
		getDiscounts( { ...params } ).then( r => { } );
	}, [] );

	const getDiscounts = async ( filters ) =>
	{
		const response = await discountApi.getDiscounts( filters )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			console.log( '------------- : response: ', response );
			setDiscounts( response.data.discounts );
			setPaging( { ...response.meta } );
		}
	}

	const handleDelete = async ( id ) =>
	{
		const response = await discountApi.delete( id );
		if ( response?.status === 'success' || response?.status === 200 )
		{
			toast( "Xóa thành công!" );
			getDiscounts( { ...params } ).then( r => { } );
		} else
		{
			toast( response?.error || 'error' );
		}
	}

	return (
		<div>
			<Container>
				<Row>
					<Col>
						<Breadcrumb>
							<Breadcrumb.Item href="/discount" >
								Mã giảm giá
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
						</Breadcrumb>

						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/discount/create' } >Thêm mới</Link>
						</div>
						<Table responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Price</th>
									<th>Status</th>
									<th>Created</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{ discounts.length > 0 ?
									discounts.map( ( item, key ) =>
									{
										return (
											<tr key={ item._id }>
												<td>{ key + 1 }</td>
												<td>
													<Link to={ `/discount/update/${ item._id }` }>
														{ item.name }
													</Link>
												</td>
												<td>{ currencyFormat( item.price ) }</td>
												<td>{ item.status }</td>
												<td>{ moment( item.created_at ).format( "MM-DD-YYYY H:mm:ss" ) }</td>
												<td>
													<Button variant="danger" size="sm" onClick={ () => handleDelete( item._id ) }>
														Delete
													</Button>{ ' ' }
												</td>
											</tr>
										)
									} )
									:
									<tr>
										<td className='text-center' colSpan={ 5 }>Không có dữ liệu</td>
									</tr>
								}
							</tbody>
						</Table>
					</Col>
				</Row>
				{
					paging.total > 0 &&
					<Pagination
						total={ paging.total }
						page={ paging.current_page }
						pageSize={ paging.page_size }
						onPageChange={ ( e ) =>
						{
							getDiscounts( { ...params, page_size: paging.page_size, page: e } )
						} }
					/>
				}
			</Container>
		</div>
	);
}
