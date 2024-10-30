import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import userApi from "../../services/userService";
import moment from 'moment';
import ImageForm from '../../common/form/imageForm';
import uploadApi from '../../services/uploadService';

export default function UpdateUser() {

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState('Nam');
    const [birthday, setBirthday] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [type, setType] = useState('USER');

	const [change, setChange] = useState(false);

	const [ fileAlbums, setFileAlbums ] = useState( [
		{
			imgBase64: null,
			file: null
		}
	] );

    const params = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }else {
            let data = {
                name: name,
                avatar: avatar,
                type: type,
                email: email,
                birthday: birthday,
                sex: sex,
            }

			const albums = await uploadApi.uploadMultiImg( fileAlbums );
			if(albums?.length > 0) {
				data.avatar = albums[0]
			}

            const response = await userApi.update(params.id, data);
            if (response.status === 'success' || response.status === 200) {
                toast("Cập nhật thành công");
                navigate('/user')
            } else {
                toast(response?.message || response?.error || 'error');
            }
        }

        setValidated(true);
    };

    const findByUser = async (id) => {
        const response = await userApi.findById(id);
        if (response.status === 'success' || response.status === 200) {
            setName(response.data.name);
            setEmail(response.data.email);
            setSex(response.data.sex);
            setType(response.data.type);
            setAvatar(response.data.avatar);
			if(response.data.avatar) {
				setFileAlbums( [{
					imgBase64: response.data.avatar,
					file: null
				}] );
				setChange( true )
			}
            setBirthday(moment(response.data.birthday).format("yyyy-MM-DD"));
        } else {
            toast(response?.message || response?.error || 'error');
        }
    }

    useEffect( () =>
    {
        // getDetailData();
        if ( params.id )
        {
            console.log('--------- params.id: ', params.id);
            findByUser(params.id);
        }
    }, [ params.id ] );

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item  href="/admin" >
                                Admin
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Thêm mới</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={'d-flex justify-content-end'}>
                            <Link className={'btn btn-sm btn-primary'} to={'/user'} >Trở về</Link>
                        </div>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Họ tên</Form.Label>
                                <Form.Control  required type="text" name={'name'} placeholder="Nguyễn Văn A"
                                               onChange={event => setName(event.target.value)}
                                               value={name}/>
                                <Form.Control.Feedback type="invalid">
                                    Tên không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email</Form.Label>
                                <Form.Control  required type="email" name={'email'} placeholder="nguyenvana@gmail.com"
                                               onChange={event => setEmail(event.target.value)}
                                               value={email}/>
                                <Form.Control.Feedback type="invalid">
                                    Email không được để trống
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Row>
                                <Col className={'col-3'}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Giới tính</Form.Label>
                                        <Form.Control  required type="text" name={'sex'} placeholder="Nam"
                                                       onChange={event => setSex(event.target.value)}
                                                       value={sex}/>
                                    </Form.Group>
                                </Col>
                                <Col className={'col-3'}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Ngày sinh</Form.Label>
                                        <Form.Control  required type="date" name={'birthday'} placeholder=""
                                                       onChange={event => setBirthday(event.target.value)}
                                                       value={birthday}/>
                                        <Form.Control.Feedback type="invalid">
                                            Ngày sinh không được để trống
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {/* <Col className={'col-3'}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Loại tài khoản</Form.Label>
                                        <Form.Control  required type="text" name={'type'} placeholder="USER"
                                                    //    onChange={event => setType(event.target.value)}
                                                       value={type}/>
                                        <Form.Control.Feedback type="invalid">
                                            Loại tài khoản không được để trống
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col> */}
                            </Row>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Avatar</Form.Label>
                                <ImageForm files={ fileAlbums } changes={ change } setChanges={ setChange } setFiles={ setFileAlbums } max={ 1 } />
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
