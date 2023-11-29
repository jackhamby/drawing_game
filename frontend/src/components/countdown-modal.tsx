import "./form-modal.scss";

export interface ModalProps {
    style?: Record<string, any>;
    content: any;
}

export const CountDownModal = (props: ModalProps) => {
    return (
        <div className="modal-main">
            <div className="modal-wrapper" style={props.style}>
                <div className="modal-content">
                    {/* <div style={{}}></div> */}
                    {props.content}
                    {/* <div className="modal-buttons">

                    </div> */}
                </div>
            </div>
        </div>  
    );
}