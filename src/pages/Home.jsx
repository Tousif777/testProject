import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/userContext';
import Topbar from '../components/Topbar';
import { toast } from 'react-toastify';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseInit';
import SectorsSelect from '../components/SectorsComponent';
import DevelopmentTools from './../DevelopmentTools';

const Home = () => {
    const { user } = useUserContext();

    const [name, setName] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [termAgree, setTermAgree] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setName(userData.name);
                    setSelectedSector(userData.selectedSector);
                    setTermAgree(userData.termAgree);
                }
            } catch (error) {
                console.error('Error fetching user data from Firestore:', error);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const handleUpdateFirestore = async () => {
        try {
            const userData = {
                name,
                selectedSector,
                termAgree,
            };

            const userDocRef = doc(db, 'users', user.uid);
            if (userDocRef.exists()) {
                await setDoc(userDocRef, userData, { merge: true });
            } else {
                await setDoc(userDocRef, userData);
            }

            toast.success('User data updated in Firestore');
        } catch (error) {
            console.error('Error updating user data in Firestore:', error);
        }
    };

    return (
        <>
            <Topbar />
            <div className='w-full mx-auto flex flex-col max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8'>
                <h5>{user && user.displayName}</h5>
                <input
                    type='text'
                    placeholder='Enter your name'
                    className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <SectorsSelect setSelectedSector={setSelectedSector} selectedSector={selectedSector}/>
                <input
                    type='checkbox'
                    className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                    checked={termAgree}
                    onChange={(e) => setTermAgree(e.target.checked)}
                />
                <label className='ml-2 text-gray-700'>Term agree</label>
                <button onClick={handleUpdateFirestore}>Update User Data</button>
            </div>
        </>
    );
};

export default Home;
