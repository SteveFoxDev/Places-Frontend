import { createPortal } from 'react-dom';

import './Backdrop.css';

export default function Backdrop(props){
    return (
        createPortal(
            <div className="backdrop" onClick={props.onClick}></div>,
            document.getElementById('backdrop-hook')
        )
    );
}