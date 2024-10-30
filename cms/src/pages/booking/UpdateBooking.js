import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import roomApi from "../../services/roomService";
import {toast} from "react-toastify";
import uploadApi from "../../services/uploadService";
import bookingApi from "../../services/bookingService";

export default function UpdateBooking() {
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const navigate = useNavigate();
    const params = useParams();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let data = {
                status: status,
            }

            const response = await bookingApi.update(params.id,data);
            if (response.status === 'success' || response.status === 200) {
                toast("Cập nhật thành công");
                navigate('/booking')
            } else {
                toast(response?.message || response?.error || 'error');
            }
        }

        setValidated(true);
    };


    const findById = async (id) => {
        const response = await bookingApi.findById(id);
        console.log('----------- response: ', response);
        if (response.status === 'success' || response.status === 200) {
            console.log('---------- OK');
            setName(response.data?.name);
        } else {
            toast(response?.message || response?.error || 'error');
        }
    }

    const handleChangeStatus = (event) => {
        setStatus(event.target.value);
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
                            <Breadcrumb.Item  href="/discount" >
                                Phòng
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Cập nhật</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/room'} >Trở về</Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Row>
                                <Col className={'col-3'}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={handleChangeStatus}>
                                            <option value="Đang xử lý">Đang xử lý</option>
                                            <option value="Chấp nhận">Chấp nhận</option>
                                            <option value="Từ chối">Từ chối</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Số phòng ngủ không được để trống
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Button  type="submit">Lưu dữ liệu</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
