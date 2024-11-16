import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import faciApi from '../../services/facilityService';
import moment from "moment/moment";
import { toast } from "react-toastify";
import { Pagination } from '../../common/form/pagination';

export default function PageFacility ()
{

	const [ paging, setPaging ] = useState( {
		page: 1,
		current_page: 1,
		page_size: 10,
		total: 0
	} );

	const [ params, setParams ] = useState( {} );

	const [ facilities, setFacilities ] = useState( [] );

	useEffect( () =>
	{
		getLists( { ...params, ...paging } ).then( r => { } );
	}, [] );

	const getLists = async ( filters ) =>
	{
		const response = await faciApi.getLists( filters )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			setFacilities( response.data.facilities );
			setPaging(response.meta)
		}
	}

	const handleDelete = async ( id ) =>
	{
		const response = await faciApi.delete( id );
		if ( response?.status === 'success' || response?.status === 200 )
		{
			toast( "Xóa thành công!" );
			getLists( { ...params } ).then( r => { } );
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
							<Breadcrumb.Item href="/facility" >
								Tiện nghi
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
						</Breadcrumb>
						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/facility/create' } >Thêm mới</Link>
						</div>
						<Table responsive striped>
							<thead>
								<tr>
									<th>STT</th>
									<th>Tên</th>
									<th>Ngày tạo</th>
									<th>Hành động</th>
								</tr>
							</thead>
							<tbody>
								{ facilities.length > 0 ? facilities.map( ( item, key ) =>
								{
									return (
										<tr key={ item._id }>
											<td>{ key + 1 }</td>
											<td>
												<Link to={ `/facility/update/${ item._id }` }>{ item.name }</Link>
												<p className='text-truncate' style={ { maxWidth: '300px' } }>{ item.description }</p>
											</td>
											<td>{ moment( item.created_at ).format( "MM-DD-YYYY H:mm:ss" ) }</td>
											<td>
												<Button variant="danger" size="sm" onClick={ () => handleDelete( item._id ) }>
													Xóa
												</Button>{ ' ' }
											</td>
										</tr>
									)
								} )
									:
									<tr>
										<td className='text-center' colSpan={ 4 }>Đang tải</td>
									</tr>
								}
							</tbody>
						</Table>

						{
							paging.total > 0 &&
							<Pagination
								total={ paging.total }
								page={ paging.current_page }
								pageSize={ paging.page_size }
								onPageChange={ ( e ) =>
								{
									getLists( { ...params, page_size: paging.page_size, page: e } )
								} }
							/>
						}
					</Col>
				</Row>
			</Container>
		</div>
	);
}
