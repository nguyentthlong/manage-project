import React from 'react'
import './main-layout.scss'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import NavigationBar from '../components/NavPage'
import Footer from '../components/Footer'

const MainLayout = () => {
    return (
        <>
            <Sidebar />
            <div className="main">
                <div className="main__content">
                    <Outlet />
                </div>
            </div>
        </>
    )
}
 

export default MainLayout