import React, { useEffect, useState } from 'react';
import {Badge, Breadcrumb, Button, Col, Container, Row} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link, useSearchParams } from "react-router-dom";
import bookingApi from '../../services/bookingService';
import moment from "moment";
import currencyFormat, {URL_IMG} from "../../common/common";
import {toast} from "react-toastify";
import { Pagination } from '../../common/form/pagination';
import { buildFilter } from '../../services/common';

export default function PageBooking() {

    const [paging, setPaging] = useState({
        page: 1,
        page_size: 10,
        total: 0,
		current_page: 1
    });

    const [params, setParams] = useState({

    });

    const [bookings, setBookings] = useState();
	const [ paramSearch, setParamSearch ] = useSearchParams()


    useEffect(() => {
        getBookings({...params, ...paging}).then(r =>{});
    }, []);

    const getBookings = async (filters) => {
		filters = buildFilter(filters);
		setParamSearch(filters);
        const response = await bookingApi.index(filters)
        console.log('--------- response: ', response)
        if (response?.status === 'success' || response?.status === 200) {
            setBookings(response.data.bookings);
			setPaging(response.meta)
        }
    }

    const handleDelete = async (id) => {
        const response = await bookingApi.delete(id);
        if (response?.status === 'success' || response?.status === 200) {
            toast("Xóa thành công!");
            getBookings({...params}).then(r =>{});
        } else {
            toast(response?.error || 'error');
        }
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/booking" >
                                Quản lý đặt phòng
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
                        </Breadcrumb>
                        {/*<div className={'d-flex justify-content-end'}>*/}
                        {/*    <Link className={'btn btn-sm btn-primary'} to={'/room/create'} >Thêm mới</Link>*/}
                        {/*</div>*/}
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Room</th>
                                    <th>Price</th>
                                    <th>Discount</th>
                                    <th>Total</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                    <th>Payment Type</th>
                                    <th>Payment</th>
                                    <th>Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings ?
                                    bookings.map((item, key) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>{key + 1}</td>
                                                <td>
                                                    <ul style={{ paddingLeft: 0}}>
                                                        <li>{item.customer_name}</li>
                                                        <li>{item.customer_email}</li>
                                                        <li>{item.customer_phone}</li>
                                                    </ul>
                                                </td>
                                                <td>
                                                    <Link className={''} to={`/booking/update/${item._id}`} >{item.room?.name}</Link>
                                                </td>
                                                <td>
                                                    <span className={'text-success'}>{currencyFormat(item.price)} đ</span>
                                                </td>
                                                <td>
                                                    { item.discount > 0  && (
                                                        <span className={'text-danger'}>- {currencyFormat(item.discount)} đ</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={'text-success'}>{currencyFormat(item.total_money)} đ</span>
                                                </td>
                                                <td>
                                                    {moment(item.check_in).format("MM-DD-YYYY")}
                                                </td>
                                                <td>
                                                    {moment(item.check_out).format("MM-DD-YYYY")}
                                                </td>
                                                <td>
                                                    <Badge bg="primary">{ item.status}</Badge>
                                                </td>
                                                <td>
                                                    { item.payment_type == 1 ? (
                                                        <Badge bg="primary">Chuyển khoản</Badge>
                                                    ) : (
                                                        <Badge bg="info">TT Online</Badge>
                                                    )}
                                                </td>
                                                <td><Badge bg="secondary">{ item.status_payment}</Badge></td>
                                                <td>{moment(item.created_at).format("MM-DD-YYYY H:mm:ss")}</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>
                                                        Delete
                                                    </Button>{' '}
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td className='text-center' colSpan={7}>Không có dữ liệu</td>
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
									getBookings( { ...params, page_size: paging.page_size, page: e } )
								} }
							/>
						}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
