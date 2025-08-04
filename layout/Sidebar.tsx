import React from 'react';
import './styles/sidebar.css';

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
          ♦ Softthai 
        <div className="sidebar-menu">
          <div>Dashboard</div>
          <div>News</div>
          <div>Document</div>
          <div>User Role</div>
          <div>User Group</div>
          <div>User Permission</div>
          <div>Master Data</div>
          <div>History Log</div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
