import { useRef } from 'react';  
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.css';

export default function SideDrawer(props) {
    const nodeRef = useRef(null);
    const content = (
        <CSSTransition
            nodeRef={nodeRef}
            in={props.show}
            timeout={300}
            classNames='slide-in-left'
            mountOnEnter
            unmountOnExit
        >
            <aside ref={nodeRef} className="side-drawer">{props.children}</aside>
        </CSSTransition>
    );
    
    return (
        createPortal(content, document.getElementById('drawer-hook'))
    );
}