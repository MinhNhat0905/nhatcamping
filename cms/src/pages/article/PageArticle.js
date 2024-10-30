import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import articleApi from '../../services/articleService';
import {DEFAULT_IMG, URL_IMG, onErrorImg} from "../../common/common";
import moment from "moment/moment";
import {toast} from "react-toastify";
import { Pagination } from '../../common/form/pagination';

export default function PageArticle() {

    const [paging, setPaging] = useState({
        page: 1,
        page_size: 20,
        total: 0,
		current_page: 1
    });

    const [params, setParams] = useState({

    });

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticles({...params}).then(r =>{});
    }, []);

    const getArticles = async (filters) => {
        const response = await articleApi.getArticles(filters)
        if (response?.status === 'success' || response?.status === 200) {
            setArticles(response.data.articles);
			setPaging(response.meta)
        }
    }

    const handleDelete = async (id) => {
        const response = await articleApi.delete(id);
        if (response?.status === 'success' || response?.status === 200) {
            toast("Xóa thành công!");
            getArticles({...params}).then(r =>{});
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
                            <Breadcrumb.Item href="/article" >
                                Tin tức
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Danh sách</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/article/create'} >Thêm mới</Link>
                        </div>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Avatar</th>
                                    <th>Info</th>
                                    <th>Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.length > 0 ? articles.map((item, key) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>{ key + 1}</td>
                                                <td>
                                                    <img src={item.avatar ? URL_IMG + item.avatar : DEFAULT_IMG} style={{ width: "100px", height: "auto" }} alt="" onError={onErrorImg}/>
                                                </td>
                                                <td>
                                                    <Link to={`/article/update/${item._id}`}>{item.name}</Link>
                                                    <p className='text-truncate' style={{maxWidth: '300px'}}>{item.description}</p>
                                                </td>
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

						{
							paging.total > 0 &&
							<Pagination
								total={ paging.total }
								page={ paging.current_page }
								pageSize={ paging.page_size }
								onPageChange={ ( e ) =>
								{
									getArticles( { ...params, page_size: paging.page_size, page: e } )
								} }
							/>
						}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
