import React, {useState, useEffect} from 'react';
import {Breadcrumb, Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import serviceApi from '../../services/serviceService';
import uploadApi from '../../services/uploadService';
import {URL_IMG} from "../../common/common";

export default function CreateService() {
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState('');
    const [service_content, setServiceContent] = useState();
    const [file, setFile] = useState();

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
                description: description,
                avatar: avatar || null,
                service_content: service_content,
            }

            const resFile = await uploadApi.uploadFile(file);
            if (resFile) data.avatar = resFile;

            const response = await serviceApi.updateService(params.id, data);
            if (response.status === 200) {
                toast("Chỉnh sửa thành công");
                navigate('/service');
            } else {
                toast(response?.message || response?.error || 'error')
            }
        }

        setValidated(true);
    };

    const handleUpload = (event) => {
        if (event && event.target.files[0]) setFile(event.target.files[0]);
    }

    const findById = async (id) => {
        const response = await serviceApi.findById(id);
        if (response.status === 'success' || response.status === 200) {
            setName(response.data.name);
            setDescription(response.data.description);
            setAvatar(response.data.avatar);
            setServiceContent(response.data.service_content);
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
                            <Breadcrumb.Item  href="/service" >
                                Dịch vụ
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/service'}>Trở về</Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Tên dịch vụ</Form.Label>
                                <Form.Control  required type="text" name={'name'} placeholder="Tên dịch vụ"
                                               onChange={event => setName(event.target.value)}
                                               value={name}/>
                                <Form.Control.Feedback type="invalid">
                                    Tên dịch vụ không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Mô tả ( 180 ký tự )</Form.Label>
                                <Form.Control as="textarea" name={"description"} rows={2}
                                              placeholder={'Mô tả dịch vụ'}
                                              onChange={event => setDescription(event.target.value)}
                                              value={description}
                                />
                            </Form.Group>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control type="file"  accept="image/*" onChange={(event) => handleUpload(event)}/>
                                { avatar && (
                                    <p style={{ marginTop: "10px"}}>
                                        <img src={URL_IMG + avatar} style={{ width: "100px", height: "auto" }} alt="" />
                                    </p>
                                )}

                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control as="textarea" name={"service_content"} rows={5}
                                              placeholder={'Nội dung'}
                                              onChange={event => setServiceContent(event.target.value)}
                                              value={service_content}
                                />
                            </Form.Group>
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
