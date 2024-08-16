import { Link } from 'react-router-dom';
import { useState } from 'react';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

import './MainNavigation.css';

export default function MainNavigation(props) {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerIsOpen(!drawerIsOpen);
    };

    const styles = {height: '4rem', background: 'blue'};

    return (
        <>
            {drawerIsOpen && <Backdrop onClick={toggleDrawer} />}
            <SideDrawer show={drawerIsOpen}>
                <button
                    className="main-navigation__drawer-btn"
                    onClick={toggleDrawer}
                >
                    Close
                </button>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks onClick={toggleDrawer} />
                </nav>
            </SideDrawer>

            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={toggleDrawer}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">Your Places</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    );
}