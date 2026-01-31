import React, { Suspense } from 'react';
import BrowseClient from './BrowseClient';

function ProfessionalsLoading() {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-slate-200 rounded-xl w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="h-64 bg-slate-200 rounded-xl"></div>
                        <div className="md:col-span-3 space-y-6">
                            <div className="h-48 bg-slate-200 rounded-xl"></div>
                            <div className="h-48 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfessionalsPage() {
    return (
        <Suspense fallback={<ProfessionalsLoading />}>
            <BrowseClient />
        </Suspense>
    );
}
