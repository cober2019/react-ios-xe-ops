import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

export const pageLoader = <Row>
                            <Col xl={2}/>
                            <Col xl={8}>
                            <Card bg="dark" className="mb-3">
                            <Card.Body>
                                <h3 className="blinking-loader">Collecting Data From {localStorage.getItem('ip')}</h3>
                                <br/>
                                <h6 >Device Model/SN: {localStorage.getItem('model')} ({localStorage.getItem('serial')})</h6>
                                <h6 >Uptime: {localStorage.getItem('uptime')}</h6>
                                <h6 >Software:  ({localStorage.getItem('software')})</h6>
                            </Card.Body>
                            </Card>
                            </Col>
                            <Col xl={2}/>
                        </Row>


