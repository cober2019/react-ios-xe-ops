import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Row'

export function RestQueryModal(props) {

  if(props.msg === 'Request Timeout'){

    return (
      <Modal {...props} size="sm"  backdrop={true}>
        <Modal.Body>
          <p style={{color: 'black', textAlign: 'center'}}>{props.msg}</p>
          <p style={{color: 'black', textAlign: 'center'}}>The App Did Not Receive A Response From The Device</p>
        </Modal.Body> 
        <Modal.Footer>
        <Col className="d-flex justify-content-center"><Button size="sm" variant="danger" onClick={props.onHide} style={{alignItems: 'center'}}>Resend</Button></Col>
        </Modal.Footer>
      </Modal>
    );
  }
  else if(props.msg === 'Fetching'){
    return <Modal {...props} size="sm"  backdrop={true}>
            <Modal.Body>
              <p style={{color: 'black', textAlign: 'center'}}>{props.msg}</p>
              <div style={{marginLeft: '100px'}}><div className="spinner"/></div>
            </Modal.Body> 
          </Modal>
  }
  else{
    return <Modal {...props} size="sm" backdrop={true}>
            <Modal.Body>
              <p style={{color: 'black', textAlign: 'center'}}>{props.msg}</p>
            </Modal.Body>
            <Modal.Footer>
              <Col className="d-flex justify-content-center"><Button size="sm" variant="danger" onClick={props.onHide} style={{alignItems: 'center'}}>Exit</Button></Col>
            </Modal.Footer> 
          </Modal>
  
  }
}
