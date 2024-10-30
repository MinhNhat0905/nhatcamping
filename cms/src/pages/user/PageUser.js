import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Col, Container, Row} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import userApi from "../../services/userService";
import {Link} from "react-router-dom";
import moment from "moment/moment";
import { Pagination } from '../../common/form/pagination';

export default function PageUser() {

    const [paging, setPaging] = useState({
        page: 1,
        page_size: 20,
        total: 0,
		current_page: 1
    });

    const [params, setParams] = useState({

    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers({...params}).then(r =>{});
    }, []);

    const getUsers = async (filters) => {
        const response = await userApi.getLists(filters)
        console.log(typeof response.stauts === 200)
        if (response?.status === 'success' || response?.status === 200) {
            setUsers(response.data.users);
			setPaging(response.meta)
        }
    }


    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item  href="/discount" >
                                Thành viên
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/user/create'} >Thêm mới</Link>
                        </div>
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Sex</th>
                                <th>Birthday</th>
                                <th>Type</th>
                                <th>Created</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((item, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>
                                                    <Link className={''} to={`/user/update/${item._id}`} >{item.name}</Link>
                                                </td>
                                                <td>{item.email}</td>
                                                <td>{ (item.sex === 'nu' || item.sex === 'Nữ') ? 'Nữ' : "Nam" }</td>
                                                <td>{moment(item.birthday).format("MM-DD-YYYY")}</td>
                                                <td>{item.type}</td>
                                                <td>{moment(item.created_at).format("MM-DD-YYYY")}</td>
                                                <td>
                                                    <Button variant="danger" size="sm">
                                                        Delete
                                                    </Button>{' '}
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td className='text-center' colSpan={4}>Không có dữ liệu</td>
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
									getUsers( { ...params, page_size: paging.page_size, page: e } )
								} }
							/>
						}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
