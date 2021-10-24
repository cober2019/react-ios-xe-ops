import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'

export function LoginModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={true}
       >
           
        <Modal.Body>
          <p style={{color: 'black', textAlign: 'center', fontWeight: 'bold'}}>{props.msg}</p>
          {props.msg !== 'Authentication Failed' ? <div style={{marginLeft: '100px'}}><div className="spinner"/></div>: <p style={{color: 'black', textAlign: 'center'}}>Verify RESTCONF Capabilities and Credentials</p>}
        </Modal.Body> 
        <Modal.Footer className="corder-0">
        {props.msg === 'Authentication Failed' ? <Col className="d-flex justify-content-center"><Button size="sm" variant="danger" onClick={props.onHide} style={{alignItems: 'center'}}>ReAuth</Button></Col> : <div></div>}
        </Modal.Footer>
      </Modal>
    );
  }