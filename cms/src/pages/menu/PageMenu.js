import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import menuApi from '../../services/menuService';
import moment from "moment/moment";
import { toast } from "react-toastify";
import { Pagination } from '../../common/form/pagination';

export default function PageMenu ()
{

	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 20,
		total: 0,
		current_page: 1
	} );

	const [ params, setParams ] = useState( {} );

	const [ menus, setMenus ] = useState( [] );

	useEffect( () =>
	{
		getLists( { ...params } ).then( r => { } );
	}, [] );

	const getLists = async ( filters ) =>
	{
		const response = await menuApi.getLists( filters )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			setMenus( response.data.menus );
		}
	}

	const handleDelete = async ( id ) =>
	{
		const response = await menuApi.delete( id );
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
							<Breadcrumb.Item href="/menu" >
								Menu tin tức
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
						</Breadcrumb>
						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/menu/create' } >Thêm mới</Link>
						</div>
						<Table responsive striped>
							<thead>
								<tr>
									<th>STT</th>
									<th>Name</th>
									<th>Time</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{ menus.length > 0 ? menus.map( ( item, key ) =>
								{
									return (
										<tr key={ item._id }>
											<td>{ key + 1 }</td>
											<td>
												<Link to={ `/menu/update/${ item._id }` }>{ item.name }</Link>
												<p className='text-truncate' style={ { maxWidth: '300px' } }>{ item.description }</p>
											</td>
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
										<td className='text-center' colSpan={ 4 }>Không có dữ liệu</td>
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
