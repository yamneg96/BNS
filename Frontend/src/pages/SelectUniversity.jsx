import React, { useState } from 'react';
import { Universities } from '../data/data';
import UniversityCard from '../components/UniversityCard';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SelectUniversity = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const navigate = useNavigate();

    const { user } = useAuth();

    const handleuniversitySelect = (university) => {
        toast.success(`You have selected ${university.name}`);
        setIsOpen(false);
        navigate('/schools');
    };

    const openConfirm = (title, message, onConfirmCallback) => {
        setConfirmData({ title, message, onConfirm: onConfirmCallback });
        setIsOpen(true);
    };

    return user ? (
        <div className='bg-gray-100 min-h-screen p-8 flex flex-col items-center'>
            <div className='container mx-auto max-w-5xl'>
                <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                  Hello, <span className="text-indigo-600">{user.name}</span>!
                </h1>
                <h2 className='text-center text-5xl font-extrabold text-gray-800 mb-10'>
                    Select Your university
                </h2>
                <p className='text-center text-lg text-gray-600 mb-12'>
                    Please choose your university to see available departments and beds.
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    {Universities.map((university) => (
                        <UniversityCard
                            key={university}
                            university={university}
                            onClick={() => openConfirm(
                                `Confirm Selection`,
                                `Are you sure you want to select ${university.name}?`,
                                () => handleuniversitySelect(university)
                            )}
                        />
                    ))}
                </div>
            </div>
            
            <ConfirmModal
                isOpen={isOpen}
                title={confirmData.title}
                message={confirmData.message}
                onConfirm={confirmData.onConfirm}
                onCancel={() => setIsOpen(false)}
                isDestructive={false}
            />
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center'>
            <div className='bg-white shadow-xl rounded-2xl p-10 max-w-md w-full'>
                <div className='text-6xl mb-4'>👩‍⚕️🩺🏥</div>
                <h2 className='text-3xl font-bold text-gray-800 mb-4'>Access Denied</h2>
                <p className='text-lg text-gray-600 mb-6'>
                    Please log in to view the available universitys and beds.
                </p>
                <a 
                    href="/login"
                    className='inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition-colors hover:bg-blue-700'
                >
                    Go to Login
                </a>
            </div>
        </div>
    );
};

export default SelectUniversity;