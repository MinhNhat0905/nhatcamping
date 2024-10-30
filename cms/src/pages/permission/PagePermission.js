import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from "react-bootstrap"

import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import permissionApi from '../../services/permissionService';
import { toast } from 'react-toastify';
import moment from "moment";
import currencyFormat from "../../common/common";
import { Pagination } from '../../common/form/pagination';

export default function PagePermission() {

    const [paging, setPaging] = useState({
        current_page: 1,
        page_size: 20,
        total: 0,
        total_page: 0,
    });

    const [params, setParams] = useState({

    });

    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        getListsPermission({...params}).then(r => {});
    }, []);

    const getListsPermission = async (filters) => {
        const response = await permissionApi.index(filters)
        if (response?.status === 'success' || response?.status === 200) {
            console.log('------------- : response: ',response);
            setPermissions(response.data.permissions);
            setPaging(response.meta);
        }
    }

    const handleDelete = async (id) => {
        const response = await permissionApi.delete(id);
        if (response?.status === 'success' || response?.status === 200) {
            toast("Xóa thành công!");
            getListsPermission({...params}).then(r => {});
        } else {
            toast(response?.error || 'error');
        }
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/permission" >
                                Permission
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
                        </Breadcrumb>

                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/permission/create'} >Thêm mới</Link>
                        </div>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Path</th>
                                    <th>Description</th>
                                    <th>Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.length > 0 ?
                                    permissions.map((item, key) => {
                                        return(
                                            <tr key={item._id}>
                                                <td>{key + 1}</td>
                                                <td>
                                                    <Link to={`/permission/update/${item._id}`}>
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td>{item.path}</td>
                                                <td>{item.description}</td>
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
                                        <td className='text-center' colSpan={5}>Không có dữ liệu</td>
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
							getListsPermission( { ...params, page_size: paging.page_size, page: e } )
						} }
					/>
				}
            </Container>
        </div>
    );
}
