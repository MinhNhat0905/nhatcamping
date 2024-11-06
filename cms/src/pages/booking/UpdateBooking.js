import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import roomApi from "../../services/roomService";
import {toast} from "react-toastify";
import uploadApi from "../../services/uploadService";
import bookingApi from "../../services/bookingService";

export default function UpdateBooking() {
    const [validated, setValidated] = useState(false);// State để theo dõi trạng thái hợp lệ của form
    const [name, setName] = useState(''); // State để lưu tên khách hàng
    const [status, setStatus] = useState('');// State để lưu trạng thái đặt phòng
    
    const navigate = useNavigate();// Khởi tạo hook điều hướng
    const params = useParams();// Lấy các tham số từ URL
    const handleSubmit = async (event) => { // Hàm xử lý khi form được gửi
        event.preventDefault();// Ngăn chặn hành động gửi form mặc định
        const form = event.currentTarget;// Lấy form hiện tại
        if (form.checkValidity() === false) {// Kiểm tra tính hợp lệ của form
            event.stopPropagation();// Ngăn chặn sự kiện nổi
        } else {
            let data = {// Tạo đối tượng dữ liệu để gửi đi
                status: status,// Trạng thái từ state
                
            }
            // Gửi yêu cầu cập nhật đến API
            const response = await bookingApi.update(params.id,data);
            if (response.status === 'success' || response.status === 200) {
                toast("Cập nhật thành công");
                navigate('/booking')
            } else {
                toast(response?.message || response?.error || 'error');
            }
        }

        setValidated(true);// Đặt trạng thái đã kiểm tra form
    };


    const findById = async (id) => {// Hàm tìm kiếm đặt phòng theo ID
        const response = await bookingApi.findById(id);
        console.log('----------- response: ', response);
        if (response.status === 'success' || response.status === 200) {
            console.log('---------- OK');
            setName(response.data?.name);
            
        } else {
            toast(response?.message || response?.error || 'error');
        }
    }

    const handleChangeStatus = (event) => {// Hàm xử lý thay đổi trạng thái
        setStatus(event.target.value);// Cập nhật trạng thái từ lựa chọn
    }


    useEffect( () => // Sử dụng hook effect để lấy dữ liệu khi component mount
    {
         // getDetailData(); // (Dòng này bị chú thích có thể được sử dụng để lấy dữ liệu chi tiết khác nếu cần)
        if ( params.id )// Kiểm tra nếu có ID trong tham số URL
        {
            findById(params.id).then(r => {});// Gọi hàm tìm kiếm đặt phòng theo ID
        }
    }, [ params.id ] );// Chạy lại effect khi ID thay đổi

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
