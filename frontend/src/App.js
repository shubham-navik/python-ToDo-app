import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://127.0.0.1:5000/api/items');
    setItems(response.data);
  };

  const addItem = async () => {
    if (itemName.trim() !== '') {
      const newItem = { name: itemName, status: false };
      const response = await axios.post('http://127.0.0.1:5000/api/items', newItem);
      setItems([...items, response.data]);
      setItemName('');
      toast.success('Item added successfully');
    } else {
      toast.error('Please enter a valid item name');
    }
  };

  const deleteItem = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/api/items/${id}`);
    setItems(items.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };

  const toggleItemStatus = async (id) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, status: !item.status } : item
    );
    setItems(updatedItems);
    // You may want to send a request to update the item status in the backend here
  };

  return (
    <div className="container flex flex-row h-screen mx-auto">
      <div className="w-1/3 p-4 border-r">
        <h1 className="text-3xl font-bold mb-4">Add Item</h1>
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow border border-gray-400 p-2 mr-2"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addItem}
          >
            Add
          </button>
        </div>
      </div>
      <div className="w-2/3 p-4 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Items</h1>
        <table className="table-auto w-full">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date & Time</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-300' : 'bg-gray-200'}>
                <td className="px-2 py-2">{item.id}</td>
                <td className="px-2 py-2">{item.name}</td>
                <td className="px-2 py-2">
                  <input
                    type="checkbox"
                    checked={item.status}
                    onChange={() => toggleItemStatus(item.id)}
                  />
                </td>
                <td className="px-2 py-2">{item.timestamp}</td>
                <td className="px-2 py-2">
                  <button 
                    className="bg-red-500 text-white px-4 py-1 rounded"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
}

export default App;
