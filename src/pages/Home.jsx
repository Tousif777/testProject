import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/userContext';
import Topbar from '../components/Topbar';
import { toast } from 'react-toastify';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseInit';
import SectorsSelect from '../components/SectorsComponent';
import Loading from '../components/Loading'; // Make sure to import your Loading component
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    selectedSector: Yup.string().required('Sector is required'),
    termAgree: Yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const Home = () => {
    const { user } = useUserContext();
    const [name, setName] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [termAgree, setTermAgree] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // For update process
    const [loading2, setLoading2] = useState(true); // For data fetching process

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, 'usersInput', user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setName(userData.name);
                    setSelectedSector(userData.selectedSector);
                    setTermAgree(userData.termAgree);
                }
                setLoading2(false); // Data fetched, loading2 is complete
            } catch (error) {
                console.error('Error fetching user data from Firestore:', error);
                setLoading2(false); // Error occurred, loading2 is complete
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    const handleUpdateFirestore = async () => {
        try {
            setIsLoading(true); // Set loading state to true

            await validationSchema.validate({ name, selectedSector, termAgree }, { abortEarly: false });
            const timeStamp = Date.now();

            const userData = {
                name,
                selectedSector,
                termAgree,
                timeStamp
            };

            const userDocRef = doc(db, 'usersInput', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                await setDoc(userDocRef, userData, { merge: true });
            } else {
                await setDoc(userDocRef, userData);
            }

            toast.success('User data updated in Firestore');
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                error.inner.forEach((err) => {
                    toast.error(err.message);
                });
            } else {
                console.error('Error updating user data in Firestore:', error);
            }
        } finally {
            setIsLoading(false); // Set loading state back to false
        }
    };

    return (
        <>
            <Topbar />

            {loading2 ? (
                <div >
                    <Loading />
                </div>
            ) : (
                <div className="relative w-full bg-white py-2">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                        <div className="w-full mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                            <p className="text-center text-lg font-medium">Add your data</p>
                            <div>
                                <label className="sr-only">Name</label>
                                <div className="relative">
                                    <input
                                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="sr-only">Selector</label>
                                <div className="relative">
                                    <SectorsSelect
                                        setSelectedSector={setSelectedSector}
                                        selectedSector={selectedSector}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="sr-only">Term agree</label>
                                <div className="relative">
                                    <input
                                        type='checkbox'
                                        className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                                        checked={termAgree}
                                        onChange={(e) => setTermAgree(e.target.checked)}
                                    />
                                    <label className='ml-2 text-gray-700'>Agree to terms</label>
                                </div>
                            </div>
                            <button
                                className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                                onClick={handleUpdateFirestore}
                                disabled={isLoading} // Disable the button while loading
                            >
                                {isLoading ? 'Updating...' : 'Update User Data'}
                            </button>

                        </div>
                    </div>
                </div>

            )}

        </>
    );
};

export default Home;
