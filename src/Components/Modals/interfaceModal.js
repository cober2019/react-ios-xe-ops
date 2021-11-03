import Modal from 'react-bootstrap/Modal'
import { CreateCard } from '../Other/jsxCard';

export function ShowInterface(props) {
  console.log(props)
    return (
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={false}
        
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {CreateCard(props.component, props.interface)}
        </Modal.Body>
      </Modal>
    );
  }