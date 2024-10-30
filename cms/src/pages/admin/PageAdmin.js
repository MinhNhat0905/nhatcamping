import React, {useEffect, useState} from 'react';
import {Badge, Breadcrumb, Button, Col, Container, Row} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import adminApi from "../../services/adminService";
import {Link} from "react-router-dom";
import moment from "moment/moment";
import { Pagination } from '../../common/form/pagination';

export default function PageAdmin() {

    const [paging, setPaging] = useState({
        page: 1,
        page_size: 20,
        total: 0, current_page: 1
    });

    const [params, setParams] = useState({

    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers({...params, ...paging}).then(r =>{});
    }, []);

    const getUsers = async (filters) => {
        const response = await adminApi.getLists(filters)
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
                                Admin
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/admin/create'} >Thêm mới</Link>
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
                                <th>Role</th>
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
                                                    <Link className={''} to={`/admin/update/${item._id}`} >{item.name}</Link>
                                                </td>
                                                <td>{item.email}</td>
                                                <td>{item.sex}</td>
                                                <td>{moment(item.birthday).format("MM-DD-YYYY")}</td>
                                                <td>{item.type}</td>
                                                <td>
                                                    { item.roles.map((role, index) => {
                                                        return (
                                                            <Badge bg="primary" className={''} style={{ marginRight: "5px"}}>{role.name}</Badge>
                                                        )
                                                    })}
                                                </td>
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
                                        <td className='text-center' colSpan={9}>Không có dữ liệu</td>
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
