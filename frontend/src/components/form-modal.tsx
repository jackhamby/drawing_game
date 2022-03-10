import { FormEvent, useRef, useState } from "react"
import { Navigate } from "react-router-dom";
import { post } from "../utils/apis";
import "./form-modal.scss";
import { Response } from "../utils/apis";

export interface ModalProps {
    link: any;
    style?: Record<string, any>;
    content: any;
    onSubmit: (data: any) => Promise<Response<any>>
}

export const FormModal = (props: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null)
    
    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formRef.current) return;        
        setIsLoading(true)
        const formData = new FormData(formRef.current);
        const jsonData = Object.fromEntries(formData.entries());
        const response = await props.onSubmit(jsonData);
        setIsLoading(false)
        if (response.error){
            setError(error)
            return;
        }
        setIsOpen(false)
    }

    if (isLoading){
        return <div> Loading <div className=""></div></div>
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}> {props.link} </div>
            { isOpen 
                ? <div className="modal-main">
                        <div className="modal-wrapper" style={props.style}>
                            <form onSubmit={submit} ref={formRef}>
                                <div className="modal-content">
                                    {props.content}
                                    {error 
                                        ? error
                                        : null
                                    }
                                    <div className="modal-buttons">
                                        <button onClick={() => setIsOpen(false)}> cancel </button>
                                        <input type="submit" value="submit"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                : null
            }
        </>
    );
}