import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';  
import Button from '../FormElements/Button'; 

import './NavLinks.css';

export default function NavLinks(props){
    const auth = useContext(AuthContext);
    return (
        <ul className="nav-links">
            <li onClick={props.onClick}>
                <NavLink to="/">All Users</NavLink>
            </li>
            {auth.isLoggedIn && 
                <li onClick={props.onClick}>
                    <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
                </li>
            }
            {auth.isLoggedIn && 
                <li onClick={props.onClick}>
                    <NavLink to="/places/new">Add Place</NavLink>
                </li>
            }
            {auth.isLoggedIn && 
                <li onClick={props.onClick}>
                    <NavLink to={`/${auth.userId}/delete`}>Delete Account</NavLink>
                </li>
            }
            {!auth.isLoggedIn &&
                <li onClick={props.onClick}>
                    <NavLink to="/auth">Authenticate</NavLink>
                </li>
            }
            {auth.isLoggedIn && 
                <Button inverse type='button' onClick={auth.logout}>Logout</Button>
            }
        </ul>
    );
}