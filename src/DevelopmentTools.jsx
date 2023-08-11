import { addDoc, collection } from 'firebase/firestore';
import React from 'react';
import { db } from './FirebaseInit';
import { toast } from 'react-toastify';

const DevelopmentTools = () => {
  const newSectorsFromSelectBox = [
    'Manufacturing',
    '&nbsp;&nbsp;&nbsp;&nbsp;Construction materials',
    '&nbsp;&nbsp;&nbsp;&nbsp;Electronics and Optics',
    '&nbsp;&nbsp;&nbsp;&nbsp;Food and Beverage',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bakery &amp; confectionery products',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beverages',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fish &amp; fish products',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Meat &amp; meat products',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Milk &amp; dairy products',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sweets &amp; snack food',
    '&nbsp;&nbsp;&nbsp;&nbsp;Furniture',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bathroom/sauna',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bedroom',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children’s room',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kitchen',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Living room',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Office',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other (Furniture)',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Outdoor',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Project furniture',
    '&nbsp;&nbsp;&nbsp;&nbsp;Machinery',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machinery components',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machinery equipment/tools',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manufacture of machinery',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maritime',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Aluminium and steel workboats',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Boat/Yacht building',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ship repair and conversion',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal structures',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repair and maintenance service',
    '&nbsp;&nbsp;&nbsp;&nbsp;Metalworking',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Construction of metal structures',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Houses and buildings',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal products',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal works',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CNC-machining',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forgings, Fasteners',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gas, Plasma, Laser cutting',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIG, TIG, Aluminum welding',
    '&nbsp;&nbsp;&nbsp;&nbsp;Plastic and Rubber',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Packaging',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic goods',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic processing technology',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blowing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moulding',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastics welding and processing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic profiles',
    '&nbsp;&nbsp;&nbsp;&nbsp;Printing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Advertising',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Book/Periodicals printing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Labelling and packaging printing',
    '&nbsp;&nbsp;&nbsp;&nbsp;Textile and Clothing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clothing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Textile',
    '&nbsp;&nbsp;&nbsp;&nbsp;Wood',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other (Wood)',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wooden building materials',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wooden houses',
    'Other',
    '&nbsp;&nbsp;&nbsp;&nbsp;Creative industries',
    '&nbsp;&nbsp;&nbsp;&nbsp;Energy technology',
    '&nbsp;&nbsp;&nbsp;&nbsp;Environment',
    'Service',
    '&nbsp;&nbsp;&nbsp;&nbsp;Business services',
    '&nbsp;&nbsp;&nbsp;&nbsp;Engineering',
    '&nbsp;&nbsp;&nbsp;&nbsp;Information Technology and Telecommunications',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Data processing, Web portals, E-marketing',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Programming, Consultancy',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Software, Hardware',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telecommunications',
    '&nbsp;&nbsp;&nbsp;&nbsp;Tourism',
    '&nbsp;&nbsp;&nbsp;&nbsp;Translation services',
    '&nbsp;&nbsp;&nbsp;&nbsp;Transport and Logistics',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Air',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rail',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Road',
    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Water'
  ];

  const processSectorsData = (rawSectors) => {
    const hierarchy = [];
    const stack = [{ level: -1, subSectors: hierarchy }];

    for (const sector of rawSectors) {
      const sectorName = sector.replace(/&nbsp;/g, '').trim();
      const hierarchyLevel = (sector.length - sectorName.length) / 6; // Each &nbsp; has a length of 6

      const newSector = { name: sectorName, subSectors: [] };

      while (stack.length > 1 && hierarchyLevel <= stack[stack.length - 1].level) {
        stack.pop();
      }

      const parent = stack[stack.length - 1];
      parent.subSectors.push(newSector);
      stack.push({ level: hierarchyLevel, subSectors: newSector.subSectors });
    }

    return hierarchy;
  };

  const handleUpdateFirestore = async () => {
    const processedData = processSectorsData(newSectorsFromSelectBox);

    try {
      await addDoc(collection(db, "sectors"), {
        processedData
      });
      toast.success('Sectors updated'); // Use 'success' instead of 'done'
      console.log('Data updated in Firestore');
    } catch (error) {
      console.error('Error updating data in Firestore:', error);
    }
  };

  return (
    <div>
      <button className='btn btn-primary' onClick={handleUpdateFirestore}>Add Sectors as Developer</button>
    </div>
  );
};

export default DevelopmentTools;
