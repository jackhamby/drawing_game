import { useState } from "react"
import "./modal.scss";

interface ModalProps {
    // modalLink: JSX.Element;
    modalContent: JSX.Element;
    onConfirm: () => void;
    onClose: () => void;
}

export const Modal = (props: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen){
        return <button onClick={() => setIsOpen(true)}> Open modal </button>
    }

    return (
        <div className="modal-wrapper">
            SOME stuff here
            <button onClick={() => setIsOpen(false)}> close modal </button>
        </div>
    )

}