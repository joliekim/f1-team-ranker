import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="mb-6">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-2 bg-gray-200 rounded"></div>
                                <div className="h-8 bg-gray-200 rounded mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center mb-4">
                                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                                <div className="ml-4 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-2 bg-gray-200 rounded w-1/2 mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton; 