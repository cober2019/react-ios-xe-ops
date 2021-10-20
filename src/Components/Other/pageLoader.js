import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

export const PageLoader = (ip, serial, model, uptime, software) => {

    const html = <Container fluid="xl">
                <Row>
                        <Col xl={2}/>
                        <Col xl={8}>
                            <Card bg="dark" className="mb-3" style={{marginTop: "100px"}}>
                                <Card.Body>
                                    <h3 className="blinking-loader">Collecting Data From {ip}</h3>
                                    <br/>
                                    <h6 >Device Model/SN: {model} ({serial})</h6>
                                    <h6 >Uptime: {uptime}</h6>
                                    <h6 >Software:  ({software})</h6>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={2}/>
                    </Row>
                     </Container>
        
    return html
}


