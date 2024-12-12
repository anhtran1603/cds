'use client'
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { faHome, faBook, faFile, faFileArchive, faUser, faCertificate, faBuilding } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname()
    const [isHomeSubmenuOpen, setIsHomeSubmenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                router.push("/");
            } else {
                setUser(user);
            }
        }
    }, [router]);

    const toggleHomeSubmenu = () => {
        setIsHomeSubmenuOpen(!isHomeSubmenuOpen);
    };

    const logout = () => {
        localStorage.removeItem("user");
        router.push("/");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white p-4">
                <div className="mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img src="/assets/logo.png" alt="Logo" className="h-20 w-30 ml-5" />
                        <h3 className="text-2xl font-bold">Hệ thống quản lý người điều khiển phương tiện đường sắt</h3>
                    </div>

                    <div className="flex items-center space-x-4 mr-5">
                        <div className="flex gap-4 items-center">
                            {/* <Avatar showFallback src='https://images.unsplash.com/broken' /> */}
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                        showFallback
                                        src='https://images.unsplash.com/broken'
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat">
                                    <DropdownItem key="profile">
                                        <b>{user?.fullname}</b>
                                    </DropdownItem>
                                    <DropdownItem key="settings">
                                        Cài đặt
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={logout}>
                                        Đăng xuất
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
                    <div>
                        {/* <div className="p-4">
                            <h2 className="text-2xl font-bold">Navigation</h2>
                        </div> */}
                        <nav className="p-4">
                            <ul>
                                <li className="mb-2">
                                    <Link href="/dashboard">
                                        <span className={pathname === '/dashboard' ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}><FontAwesomeIcon icon={faHome} color="white" width={25} /> Dashboard</span>
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <button onClick={toggleHomeSubmenu} className="block p-2 rounded hover:bg-gray-700 w-full text-left">
                                        <FontAwesomeIcon icon={faBook} color="white" width={25} />  Quản lý hồ sơ
                                    </button>
                                    {isHomeSubmenuOpen && (
                                        <ul className="pl-4">
                                            <li className="mb-2">
                                                <Link href="/dashboard/new">
                                                    <span className={pathname.includes('/dashboard/new') ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}> <FontAwesomeIcon icon={faFile} color="white" width={25} />  Hồ sơ cấp mới</span>
                                                </Link>
                                            </li>
                                            <li className="mb-2">
                                                <Link href="/dashboard/renewal">
                                                    <span className={pathname.includes('/dashboard/renewal') ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}><FontAwesomeIcon icon={faFileArchive} color="white" width={25} />  Hồ sơ cấp lại</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                                {/* <li className="mb-2">
                                    <Link href="/dashboard/employee">
                                        <span className={pathname.includes('/dashboard/employee') ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}> <FontAwesomeIcon icon={faUser} color="white" width={25} /> Quản lý người lái tàu</span>
                                    </Link>
                                </li> */}
                                <li className="mb-2">
                                    <Link href="/dashboard/license">
                                        <span className={pathname.includes('/dashboard/license') ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}> <FontAwesomeIcon icon={faCertificate} color="white" width={25} />  Quản lý giấy phép</span>
                                    </Link>
                                </li>

                                <li className="mb-2">
                                    <Link href="/dashboard/company">
                                        <span className={pathname === '/dashboard/company' ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}> <FontAwesomeIcon icon={faBuilding} color="white" width={25} /> Quản lý doanh nghiệp</span>
                                    </Link>
                                </li>
                                {user?.role === 'admin' && (
                                    <li className="mb-2">
                                        <Link href="/dashboard/user">
                                            <span className={pathname === '/dashboard/user' ? 'block p-2 rounded bg-gray-700' : 'block p-2 rounded hover:bg-gray-700'}> <FontAwesomeIcon icon={faUser} color="white" width={25} /> Quản lý người dùng</span>
                                        </Link>
                                    </li>
                                )}

                            </ul>
                        </nav>
                    </div>
                    <footer className="p-4">
                        <p className="text-sm text-gray-400">&copy; 2024 - VNR</p>
                    </footer>
                </aside>
                <main className="flex-1 p-8 bg-gray-300">
                    {children}
                </main>
            </div>
        </div>
    );
}
