import React, { useEffect, useState } from 'react'
import Topbar from '../components/Topbar'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseInit';
import Loading from '../components/Loading';

const DeatailsPage = () => {

    const [allData, setAllData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userCollectionRef = collection(db, 'usersInput');
                const userCollectionSnapshot = await getDocs(userCollectionRef);

                const fetchedUserData = [];
                userCollectionSnapshot.forEach((doc) => {
                    fetchedUserData.push(doc.data());
                });

                setAllData(fetchedUserData);
                setIsLoading(false); // Data fetched, loading is complete
            } catch (error) {
                console.error('Error fetching user data from Firestore:', error);
                setIsLoading(false); // Error occurred, loading is complete
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <Topbar />


            {isLoading ? (
                <div >
                    <Loading />
                </div>

            ) : (
                <div className="relative w-full bg-white py-2">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {allData.map((data, index) => (
                                <div key={index} className="w-full md:w-[400px] hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]">
                                    <div className="rounded-[10px] bg-white p-4  sm:p-6">
                                        <time className="block text-xs text-gray-500">
                                            {new Date(data.timeStamp).toLocaleDateString()}
                                        </time>
                                        <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                                            Name: {data.name}
                                        </h3>
                                        <h3 className="mt-0.5 text-lg font-medium text-gray-900">
                                            Selected option: {data.selectedSector}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DeatailsPage;
