import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import userApi from "../../services/userService";
import { AuthService } from '../../services/authService';
import moment from 'moment';
import uploadApi from "../../services/uploadService";
import {URL_IMG} from "../../common/common";

export default function AccountUser() {

    const [validated, setValidated] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState('Nam');
    const [birthday, setBirthday] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [_id, setID] = useState(null);
    const [ file, setFile ] = useState();

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
                email: email,
                birthday: birthday,
                sex: sex,
                _id: _id
            }
            const avatarUpload = await uploadApi.uploadFile( file );
            if ( avatarUpload ) data.avatar = avatarUpload;

            const response = await AuthService.updateInfo(data);
            if (response.status === 'success' || response.status === 200) {
                toast("Cập nhật thành công");
            } else {
                toast(response?.message || response?.error || 'error');
            }
        }

        setValidated(true);
    };

    const findByUser = async () => {
        const response = await AuthService.getProfile();
        console.log('----------- response: ', response);
        if (response.status === 'success' || response.status === 200) {
            setName(response.data.user.name);
            setEmail(response.data.user.email);
            setSex(response.data.user.sex);
            setID(response.data.user._id);
            setAvatar(response.data.user.avatar);
            setBirthday(moment(response.data.user.birthday).format("yyyy-MM-DD"));
        } else {
            toast(response?.message || response?.error || 'error');
        }
    }

    const handleUpload = ( event ) =>
    {
        if ( event && event.target.files[ 0 ] ) setFile( event.target.files[ 0 ] );
    }

    useEffect( () =>
    {
        findByUser().then(r => {});
    }, [] );

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <Breadcrumb.Item  href="/account" >
                                Tài khoản
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Cập nhật</Breadcrumb.Item>
                        </Breadcrumb>
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
                            </Row>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control type="file" accept="image/*" onChange={ ( event ) => handleUpload( event ) } />
                                { avatar && (
                                    <p style={ { marginTop: "10px" } } className='d-flex'>
                                        <img src={ URL_IMG + avatar } style={ { width: "100px", height: "auto" } } alt="" />
                                    </p>
                                ) }
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
