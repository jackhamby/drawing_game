import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
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


    const submit = async (node: HTMLFormElement) => {
        setIsLoading(true)
        const formData = new FormData(node);
        const jsonData = Object.fromEntries(formData.entries());
        const response = await props.onSubmit(jsonData);

        if (response.error){
            setIsLoading(false)
            setError(response.error.message)
            return;
        }
    }

    useEffect(() => {
        const keyPressListener = (ev: KeyboardEvent) => {
            if (!formRef.current){
                return
            }
            if (ev.key === "Enter"){
                submit(formRef.current)
            }
        }
        window.addEventListener("keydown", keyPressListener)

        return () => {
            window.removeEventListener("keydown", keyPressListener)
        }
    }, [])

    const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit(event.currentTarget)
    }

    return (
        <>
            <div onClick={() => setIsOpen(true)}> {isLoading ? "loading..." : props.link} </div>
            { isOpen 
                ? <div className="modal-main">
                    <div className="modal-wrapper" style={props.style}>
                        <form onSubmit={formSubmit} ref={formRef}>
                            <div className="modal-content">
                                {props.content}
                                <div className="modal-buttons">
                                
                                    {error 
                                        ? <div className="modal-error">{error}</div>
                                        : null
                                    }
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