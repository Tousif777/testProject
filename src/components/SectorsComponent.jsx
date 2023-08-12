import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseInit';

const SectorsSelect = ({ selectedSector, setSelectedSector }) => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sectors'));
        const data = querySnapshot.docs[0].data().processedData;
        setSectors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        setLoading(false);
      }
    };

    fetchSectors();
  }, [selectedSector]);

  const handleSelectChange = (event) => {
    const selectedSector = event.target.value;
    setSelectedSector(selectedSector);
  };

  const renderOptions = (data, level = 0) => {
    return data.map((sector, index) => (
      <React.Fragment key={index}>
        <option value={sector.name}>
          {'\u00A0\u00A0\u00A0\u00A0'.repeat(level) + sector.name}
        </option>
        {sector.subSectors.length > 0 && renderOptions(sector.subSectors, level + 1)}
      </React.Fragment>
    ));
  };

  if (loading) {
    return <p>Loading sectors...</p>;
  }

  return (
    <select className="w-full py-4 rounded-lg border-gray-300 text-gray-700 sm:text-sm" onChange={handleSelectChange} value={selectedSector}>
      <option value="">Select a sector</option>
      {renderOptions(sectors)}
    </select>
  );
};

export default SectorsSelect;
