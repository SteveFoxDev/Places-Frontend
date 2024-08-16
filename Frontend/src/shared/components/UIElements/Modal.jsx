import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';

import './Modal.css';

const ModalOverlay = props => {
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form 
                action="" 
                onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()

                }
            >
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    )
    return createPortal(content, document.getElementById('modal-hook'))
};


export default function Modal(props){
    const nodeRef = useRef(null);
    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel}/>}
            <CSSTransition 
                nodeRef={nodeRef}
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={300}
                classNames='modal'
            >
                <ModalOverlay nodeRef={nodeRef} {...props} />
            </CSSTransition>
        </>
    )
}