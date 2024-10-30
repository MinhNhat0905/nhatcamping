import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {Link, useNavigate} from "react-router-dom";
import serviceApi from '../../services/serviceService';
import {URL_IMG} from "../../common/common";
import discountApi from "../../services/discountService";
import {toast} from "react-toastify";
import { Pagination } from '../../common/form/pagination';

export default function PageService() {

    const [paging, setPaging] = useState({
        current_page: 1,
        page_size: 20,
        total: 0,
        total_page: 0,
    });

    const navigate = useNavigate();

    const [params, setParams] = useState({

    });

    const [services, setServices] = useState([]);

    useEffect(() => {
        getServices({...params}).then(r => {});
    }, []);

    const getServices = async (filters) => {
        const response = await serviceApi.getServices(filters)
        if (response?.status === 'success' || response?.status === 200) {
            setServices(response.data.services);
            setPaging({ ...response.meta });
        }
    }

    const handleDelete = async (id) => {
        const response = await serviceApi.delete(id);
        if (response?.status === 'success' || response?.status === 200) {
            toast("Xóa thành công!");
            getServices({...params}).then(r => {});
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
                            <Breadcrumb.Item href="/service" >
                                Dịch vụ
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/service/create'} >Thêm mới</Link>
                        </div>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Avatar</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services && services.length > 0 ?
                                    services.map((item, key) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>{key + 1}</td>
                                                <td>
                                                    <img src={URL_IMG + item.avatar} style={{ width: "100px", height: "auto" }} alt="" />
                                                </td>
                                                <td>
                                                    <Link to={`/service/update/${item._id}`}>
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td>{item.description}</td>
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
									getServices( { ...params, page_size: paging.page_size, page: e } )
								} }
							/>
						}
            </Container>
        </div>
    );
}
