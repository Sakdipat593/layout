import React from 'react'
/*import Header from './Header'*/
import Sidebar from './Sidebar'
import './styles/layout.css';


const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {/*<div className='header'><Header /></div>*/}
            <div className='sidebar'><Sidebar /></div>
            <h1></h1>
            <div style={{ backgroundColor: "lightgray" }}>
                {children}</div>
            <div className="sidebar-menu"><Sidebar /></div>
        </div>
    )
}

export default Layout
