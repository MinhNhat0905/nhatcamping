import { Alert, Breadcrumb, Col, Container, Row } from "react-bootstrap";
function PageErrorPermission()
{
    return (
        <Container>
            <Row>
                <Col>
                    <Alert variant="danger">
                        <Alert.Heading>Không có quyền truy cập!</Alert.Heading>
                        <p>Bạn không có quyền truy cập URL này, xin vui lòng liên hệ với ADMIN để được hỗ trợ</p>
                    </Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default PageErrorPermission;
