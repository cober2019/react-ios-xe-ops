import Modal from 'react-bootstrap/Modal'
import { CreateCard } from '../Other/jsxCard';

export function BgpModal(props) {

  return (
      <Modal
        {...props}
        size="xl"
        dialogClassName="modal-500w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop={false}
        
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {CreateCard(props.component)}
        </Modal.Body>
        
      </Modal>
    );
  }