import React from 'react'
import { useUserContext } from '../context/userContext'
import Topbar from '../components/Topbar';

const Home = () => {
    const { user } = useUserContext();
    return (
        <>
            <Topbar />
            <div className='w-full mx-auto flex flex-col max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8'>
                <h5>{user && user.email}</h5>
            </div>
        </>
    )
}

export default Home
