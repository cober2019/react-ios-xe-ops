import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container";
import { CreateCard } from '../Other/jsxCard';

export function ShowInterfaceOverlay(props) {
  console.log(props)
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={false}
        
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {CreateCard(props.component, props.interface)}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide} variant="success">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }