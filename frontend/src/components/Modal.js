import './Modal.css'
import { useState } from 'react'

const Modal = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    const text = 'Admin Credentials \n username: testuser \n password: testpass \n\n PLAID Bank Credentials \n username: user_good \n password: pass_good'

    return (
        <div className="text-end">
            <button className="btn btn-primary" onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="text-end">
                            <button className="btn-close btn-close-white" aria-label="Close" onClick={toggleModal}></button>
                        </div>
                        <h2>Info</h2>
                        <div className="display-linebreak">
                            {text}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Modal