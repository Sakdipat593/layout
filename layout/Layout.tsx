import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header';
import './styles/layout.css';


const Layout = ({ children }: { children: React.ReactNode }) => {
    // return (
    //     <div>
    //         <div className='sidebar'><Sidebar /></div>
    //         <h1></h1>
    //          <div style={{ backgroundColor: "lightgray" }}>
    //             {children}
    //          </div>
    //         <div className='header'>Header</div>
    //         <div className='content'>content</div>
    //     </div>
    // )
    return(
        <div className='container'>
            {/* ซ้าย/ */}
            <div className='sidebar-container'><Sidebar /></div>
            {/* ขวา/ */}
            <div className='wapper'>
                 {/* header/ */}
                <div className='header'><Header /></div>
                {/* content/ */}
                <div className='content'>{children}</div>
            </div>
        </div>
    )
}

export default Layout
