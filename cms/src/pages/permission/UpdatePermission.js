import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import { toast } from "react-toastify";
import permissionApi from '../../services/permissionService';

export default function UpdatePermission() {

    let { id } = useParams();

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();
    const params = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {

            let data = {
                name: name,
                path: path,
                description: description,
            }

            const response = await permissionApi.update(params.id, data);
            if (response?.status === 'success' || response?.status === 200) {
                toast("Chỉnh sửa thành công");
                navigate('/permission');
            } else {
                toast(response?.message || response?.error || 'error')
            }
        }
        setValidated(true);
    };

    const findById = async (id) => {
        const response = await permissionApi.findById(id);
        if (response.status === 'success' || response.status === 200) {
            setName(response.data.name);
            setPath(response.data.path);
            setDescription(response.data.description);
        } else {
            toast(response?.message || response?.error || 'error');
        }
    }

    useEffect( () =>
    {
        // getDetailData();
        if ( params.id )
        {
            findById(params.id).then(r => {});
        }
    }, [ params.id ] );

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/permission" >
                                Mã giảm giá
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/permission'} >Trở về</Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Tên quyền</Form.Label>
                                <Form.Control required type="text" name={'name'} placeholder="Danh sách discount"
                                              onChange={event => setName(event.target.value)}
                                              value={name} />
                                <Form.Control.Feedback type="invalid">
                                    Name không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>path</Form.Label>
                                <Form.Control required type="text" name={'name'} placeholder="permission/create"
                                              onChange={event => setPath(event.target.value)}
                                              value={path} />
                                <Form.Control.Feedback type="invalid">
                                    Path không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Description</Form.Label>
                                <Form.Control required type="text" name={'name'} placeholder="Xem được danh sách thành viên"
                                              onChange={event => setDescription(event.target.value)}
                                              value={description} />
                                <Form.Control.Feedback type="invalid">
                                    Description không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Button type="submit">Lưu dữ liệu</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
