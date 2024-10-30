import React, { useEffect, useState } from 'react';
import { Badge, Breadcrumb, Button, Col, Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link, useSearchParams } from "react-router-dom";
import roomApi from '../../services/roomService';
import moment from "moment";
import currencyFormat, { DEFAULT_IMG, URL_IMG, onErrorImg } from "../../common/common";
import { toast } from "react-toastify";
import { FormRoomSearch } from '../../common/form/formSearchRoom';
import { buildFilter } from '../../services/common';
import { Pagination } from '../../common/form/pagination';

export default function PageRoom ()
{

	const [ paging, setPaging ] = useState( {
		page: 1,
		page_size: 10,
		total: 0,
		current_page: 1
	} );

	const [ params, setParams ] = useState( {

	} );

	const [ rooms, setRooms ] = useState();

	const [ paramSearch, setParamSearch ] = useSearchParams()

	useEffect( () =>
	{
		getRooms( { ...params, page: paging.current_page, page_size: paging.page_size } ).then( r => { } );
	}, [] );

	const getRooms = async ( filters ) =>
	{
		filters = buildFilter( filters )
		setParamSearch( filters )
		const response = await roomApi.getRooms( filters )
		console.log( '--------- response: ', response )
		if ( response?.status === 'success' || response?.status === 200 )
		{
			setRooms( response.data.rooms );
			setPaging( response.meta )
		}
	}

	const handleDelete = async ( id ) =>
	{
		const response = await roomApi.delete( id );
		if ( response?.status === 'success' || response?.status === 200 )
		{
			toast( "Xóa thành công!" );
			getRooms( { ...params } ).then( r => { } );
		} else
		{
			toast( response?.error || 'error' );
		}
	}

	return (
		<div>
			<Container>
				<Row>
					<Col md={ 12 }>
						<Breadcrumb>
							<Breadcrumb.Item href="/discount" >
								Room
							</Breadcrumb.Item>
							<Breadcrumb.Item active>Danh sách phòng</Breadcrumb.Item>
						</Breadcrumb>
						<div className={ 'd-flex justify-content-end' }>
							<Link className={ 'btn btn-sm btn-primary' } to={ '/room/create' } >Thêm mới</Link>
						</div>
						<div className='my-5'>
							<FormRoomSearch
								getDataList={ getRooms }
								paging={ paging }
								setPaging={ setPaging }
								params={ params }
								setParams={ setParams }
							/>
						</div>
						<Table responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Avatar</th>
									<th>Name</th>
									<th>Category</th>
									<th>Price</th>
									<th>Info</th>
									<th>Status</th>
									<th>Created</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{ rooms ?
									rooms.map( ( item, key ) =>
									{
										return (
											<tr key={ item._id }>
												<td>{ key + 1 }</td>
												<td>
													<img src={ item.avatar ? URL_IMG + item.avatar : DEFAULT_IMG } style={ { width: "100px", height: "auto" } } alt="" onError={ onErrorImg } />
												</td>
												<td>
													<Link className={ '' } to={ `/room/update/${ item._id }` } >{ item.name }</Link>
												</td>
												<td>{ item?.category?.name }</td>
												<td>{ currencyFormat( item.price ) }</td>
												<td>
													<ul style={ { paddingLeft: 0 } }>
														{ item.max && <li>Max: { item.max }</li> }

														<li>Size: { item.size }</li>
														<li>Floors: { item.floors }</li>
														<li>RoomCode: { item.room_code }</li>
													</ul>
												</td>
												<td>
													<Badge bg="info">{ item.status }</Badge>
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
										<td className='text-center' colSpan={ 7 }>Không có dữ liệu</td>
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
									getRooms( { ...params, page_size: paging.page_size, page: e } )
								} }
							/>
						}

					</Col>
				</Row>
			</Container>
		</div>
	);
}
