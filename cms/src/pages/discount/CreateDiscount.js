import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Container, Form, Row } from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import discountApi from '../../services/discountService';

export default function CreateDiscount() {

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let data = {
                name: name,
                price: price,
            }
            const response = await discountApi.createDiscount(data);
            if (response?.status === 'success' || response?.status === 200) {
                toast("Thêm mới thành công");
                navigate('/discount');
            } else {
                toast(response?.message || response?.error || 'error')
            }
        }

        setValidated(true);
    };

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item href="/discount" >
                                Mã giảm giá
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/discount'} >Trở về</Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Tên mã giảm giá</Form.Label>
                                <Form.Control required type="text" name={'name'} placeholder="Mã giảm 50k"
                                    onChange={event => setName(event.target.value)}
                                    value={name} />
                                <Form.Control.Feedback type="invalid">
                                    Tên mã giảm giá không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Giảm giá</Form.Label>
                                <Form.Control required type="text" name={'name'} placeholder="50.000đ"
                                    onChange={event => setPrice(event.target.value)}
                                    value={price} />
                                <Form.Control.Feedback type="invalid">
                                    Giá giảm không được để trống
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
