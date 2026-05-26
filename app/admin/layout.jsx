'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Allow admin login page without token
        if (pathname === '/admin/login') {
            setChecking(false);
            return;
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
        } else {
            setChecking(false);
        }
    }, [pathname, router]);

    // Don't flash admin content while checking
    if (checking && pathname !== '/admin/login') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    return <>{children}</>;
}