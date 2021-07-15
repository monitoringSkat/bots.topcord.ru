import React from "react";
import { Modal } from "react-bootstrap";

interface Props {
    title?: string
    state: {
        show: boolean
        setShow: (show: boolean) => any
    }
}

const FullscreenModal: React.FC<Props> = ({ title, children, state }) => {  
    return (
        <Modal
          show={state.show}
          onHide={() => state.setShow(false)}
          dialogClassName="modal-70v"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
  } 

  export default FullscreenModal