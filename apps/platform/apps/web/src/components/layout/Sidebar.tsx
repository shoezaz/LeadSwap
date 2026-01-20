"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [openSections, setOpenSections] = React.useState({
        data: true,
        engage: true,
        contacts: true
    });

    const isActive = (path: string) => pathname === path;
    const getItemClass = (path: string) => `flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-2 py-1.5 rounded-[6px] cursor-pointer transition-all ${isActive(path) ? 'bg-[#eef0f2] text-[#3a4455] font-medium' : 'hover:bg-white hover:shadow-sm text-[#3a4455] font-medium'}`;

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div
            className={`h-full bg-[#f4f4f5] flex flex-col relative w-full border-r border-[#eef0f2] transition-all duration-300`}
            data-name="Nav - expanded sidebar → List"
            data-node-id="2109:106"
        >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 mb-2`}>
                {!isCollapsed && <div className="font-bold text-gray-700 whitespace-nowrap overflow-hidden px-2">LeadSwap</div>}

                <button
                    onClick={onToggle}
                    className="p-1.5 hover:bg-gray-200/50 rounded-md transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2108_1995)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.4135 2.9375H4.20192C2.84776 2.9375 1.75 4.03527 1.75 5.38942V10.7981C1.75 12.1522 2.84776 13.25 4.20192 13.25H11.4135C12.7676 13.25 13.8654 12.1522 13.8654 10.7981V5.38942C13.8654 4.03526 12.7676 2.9375 11.4135 2.9375ZM3 5.38942C3 4.72562 3.53812 4.1875 4.20192 4.1875H7.20673V12H4.20192C3.53812 12 3 11.4619 3 10.7981V5.38942ZM8.45673 12H11.4135C12.0773 12 12.6154 11.4619 12.6154 10.7981V5.38942C12.6154 4.72562 12.0773 4.1875 11.4135 4.1875H8.45673V12ZM4.2019 5.96635C4.2019 5.62117 4.48173 5.34135 4.8269 5.34135H5.37979C5.72497 5.34135 6.00479 5.62117 6.00479 5.96635C6.00479 6.31152 5.72497 6.59135 5.37979 6.59135H4.8269C4.48173 6.59135 4.2019 6.31152 4.2019 5.96635ZM4.8269 7.14423C4.48173 7.14423 4.2019 7.42405 4.2019 7.76923C4.2019 8.1144 4.48173 8.39423 4.8269 8.39423H5.37979C5.72497 8.39423 6.00479 8.1144 6.00479 7.76923C6.00479 7.42405 5.72497 7.14423 5.37979 7.14423H4.8269Z" fill="#566684" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2108_1995">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-4">
                {/* Parameters Link */}
                {/* Parameters Link */}
                <Link href="/icp" className={getItemClass('/icp')}>
                    <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                        {/* Parameters Icon */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.83594 6.92969C7.44825 8.542 10.0636 8.542 11.6759 6.92969" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.86719 5.98242C8.35044 5.98242 8.74219 5.59067 8.74219 5.10742C8.74219 4.62417 8.35044 4.23242 7.86719 4.23242C7.38394 4.23242 6.99219 4.62417 6.99219 5.10742C6.99219 5.59067 7.38394 5.98242 7.86719 5.98242Z" fill="currentColor" />
                            <path d="M10.4277 5.98242C10.911 5.98242 11.3027 5.59067 11.3027 5.10742C11.3027 4.62417 10.911 4.23242 10.4277 4.23242C9.94449 4.23242 9.55273 4.62417 9.55273 5.10742C9.55273 5.59067 9.94449 5.98242 10.4277 5.98242Z" fill="currentColor" />
                            <path d="M9.79214 13.9759L11.9891 11.6928C15.2691 8.2774 13.4229 2.12971 8.00137 2.03125C2.57983 2.13586 0.73368 8.2774 4.01368 11.6928L6.2106 13.9759" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className="text-[14px] font-medium">Parameters</span>}
                </Link>

                {/* Data Group */}
                <div className="space-y-1">
                    {!isCollapsed ? (
                        <div
                            className="flex items-center gap-2 px-2 py-1 text-[#6b7280] cursor-pointer hover:text-gray-900 transition-colors"
                            onClick={() => toggleSection('data')}
                        >
                            <svg
                                width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className={`transform transition-transform duration-200 ${!openSections.data ? '-rotate-90' : ''}`}
                            >
                                <path d="M3.58594 4.5707L0.158203 1.16055C0 0.984766 0 0.721094 0.158203 0.562891L0.5625 0.158594C0.720703 0.00039053 0.984375 0.00039053 1.16016 0.158594L3.88477 2.86562L6.5918 0.158594C6.76758 0.00039053 7.03125 0.00039053 7.18945 0.158594L7.59375 0.562891C7.75195 0.721094 7.75195 0.984766 7.59375 1.16055L4.16602 4.5707C4.00781 4.72891 3.74414 4.72891 3.58594 4.5707Z" fill="currentColor" />
                            </svg>
                            <span className="text-[12px] font-medium tracking-wide">Data</span>
                        </div>
                    ) : (
                        <div className="h-4"></div> /* Spacer for collapsed */
                    )}

                    {openSections.data && (
                        <>
                            {/* Leads - Active */}
                            {/* Leads - Active */}
                            <Link href="/prospect/searcher" className={getItemClass('/prospect/searcher')}>
                                <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.87539 7.5C2.06289 7.5 2.25039 7.6875 2.25039 7.875V9.375C2.25039 9.58594 2.06289 9.75 1.87539 9.75H0.375391C0.164454 9.75 0.000391006 9.58594 0.000391006 9.375V7.875C0.000391006 7.6875 0.164454 7.5 0.375391 7.5H1.87539ZM1.87539 0C2.06289 0 2.25039 0.1875 2.25039 0.375V1.875C2.25039 2.08594 2.06289 2.25 1.87539 2.25H0.375391C0.164454 2.25 0.000391006 2.08594 0.000391006 1.875V0.375C0.000391006 0.1875 0.164454 0 0.375391 0H1.87539ZM1.87539 3.75C2.06289 3.75 2.25039 3.9375 2.25039 4.125V5.625C2.25039 5.83594 2.06289 6 1.87539 6H0.375391C0.164454 6 0.000391006 5.83594 0.000391006 5.625V4.125C0.000391006 3.9375 0.164454 3.75 0.375391 3.75H1.87539ZM11.6254 7.875C11.8129 7.875 12.0004 8.0625 12.0004 8.25V9C12.0004 9.21094 11.8129 9.375 11.6254 9.375H4.12539C3.91445 9.375 3.75039 9.21094 3.75039 9V8.25C3.75039 8.0625 3.91445 7.875 4.12539 7.875H11.6254ZM11.6254 0.375C11.8129 0.375 12.0004 0.5625 12.0004 0.75V1.5C12.0004 1.71094 11.8129 1.875 11.6254 1.875H4.12539C3.91445 1.875 3.75039 1.71094 3.75039 1.5V0.75C3.75039 0.5625 3.91445 0.375 4.12539 0.375H11.6254ZM11.6254 4.125C11.8129 4.125 12.0004 4.3125 12.0004 4.5V5.25C12.0004 5.46094 11.8129 5.625 11.6254 5.625H4.12539C3.91445 5.625 3.75039 5.46094 3.75039 5.25V4.5C3.75039 4.3125 3.91445 4.125 4.12539 4.125H11.6254Z" fill="currentColor" />
                                    </svg>
                                </div>
                                {!isCollapsed && <span className="text-[14px]">Leads</span>}
                            </Link>

                            {/* Lists */}
                            {/* Lists */}
                            <Link href="/prospect/lists" className={getItemClass('/prospect/lists')}>
                                <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.000391006 12V1.125C0.000391006 0.515625 0.492579 0 1.12539 0H7.87539C8.48477 0 9.00039 0.515625 9.00039 1.125V12L4.50039 9.375L0.000391006 12Z" fill="currentColor" />
                                    </svg>
                                </div>
                                {!isCollapsed && <span className="text-[14px]">Lists</span>}
                            </Link>
                        </>
                    )}
                </div>

                {/* Engage Group */}
                <div className="space-y-1">
                    {!isCollapsed && (
                        <div
                            className="flex items-center gap-2 px-2 py-1 text-[#6b7280] cursor-pointer hover:text-gray-900 transition-colors"
                            onClick={() => toggleSection('engage')}
                        >
                            <svg
                                width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"
                                className={`transform transition-transform duration-200 ${!openSections.engage ? '-rotate-90' : ''}`}
                            >
                                <path d="M3.58594 4.5707L0.158203 1.16055C0 0.984766 0 0.721094 0.158203 0.562891L0.5625 0.158594C0.720703 0.00039053 0.984375 0.00039053 1.16016 0.158594L3.88477 2.86562L6.5918 0.158594C6.76758 0.00039053 7.03125 0.00039053 7.18945 0.158594L7.59375 0.562891C7.75195 0.721094 7.75195 0.984766 7.59375 1.16055L4.16602 4.5707C4.00781 4.72891 3.74414 4.72891 3.58594 4.5707Z" fill="currentColor" />
                            </svg>
                            <span className="text-[12px] font-medium tracking-wide">Engage</span>
                        </div>
                    )}

                    {openSections.engage && (
                        <>
                            {/* Email */}
                            <Link href="/outreach" className={getItemClass('/outreach')}>
                                <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.37539 10.5H1.12539C0.492579 10.5 0.000391006 10.0078 0.000391006 9.375V1.125C0.000391006 0.515625 0.492579 0 1.12539 0H9.37539C9.98477 0 10.5004 0.515625 10.5004 1.125V9.375C10.5004 10.0078 9.98477 10.5 9.37539 10.5ZM4.5707 8.20312L8.8832 3.89062C9.02383 3.75 9.02383 3.51562 8.8832 3.375L8.34414 2.83594C8.20352 2.69531 7.96914 2.69531 7.82852 2.83594L4.31289 6.35156L2.64883 4.71094C2.5082 4.57031 2.27383 4.57031 2.1332 4.71094L1.59414 5.25C1.45352 5.39062 1.45352 5.625 1.59414 5.76562L4.03164 8.20312C4.17227 8.36719 4.43008 8.36719 4.5707 8.20312Z" fill="currentColor" />
                                    </svg>
                                </div>
                                {!isCollapsed && <span className="text-[14px]">Email</span>}
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Footer Section (Node 2099:1266) */}
            <div className="p-3 mt-auto space-y-1">
                {/* Try on ChatGPT */}
                <Link href="https://chatgpt.com/store" target="_blank" className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-2 py-1.5 rounded-[6px] hover:bg-white hover:shadow-sm text-[#3a4455] font-medium cursor-pointer transition-all`}>
                    <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                        {/* Rocket Icon */}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.8363 0.46875C12.0004 1.21875 12.0004 1.80469 11.977 2.39062C11.977 4.80469 10.6879 6.25781 8.97695 7.33594V9.79688C8.97695 10.1719 8.71914 10.6172 8.36758 10.8047L6.04727 11.9531C5.97695 11.9766 5.8832 12 5.81289 12C5.48477 12 5.25039 11.7656 5.22695 11.4375V9.02344L4.71133 9.53906C4.40664 9.84375 3.91445 9.79688 3.65664 9.53906L2.46133 8.34375C2.15664 8.03906 2.18008 7.54688 2.46133 7.28906L2.97695 6.75H0.562891C0.234766 6.75 0.000391006 6.51562 0.000391006 6.1875C0.000391006 6.11719 0.0238285 6.02344 0.047266 5.95312L1.1957 3.63281C1.3832 3.28125 1.82852 3.02344 2.20352 3H4.66445C5.74258 1.3125 7.1957 0 9.60977 0C10.1957 0 10.7816 0 11.5316 0.164062C11.6723 0.210938 11.7895 0.328125 11.8363 0.46875ZM9.00039 3.9375C9.51602 3.9375 9.93789 3.53906 9.93789 3C9.93789 2.48438 9.51602 2.0625 9.00039 2.0625C8.46133 2.0625 8.06289 2.48438 8.06289 3C8.06289 3.53906 8.46133 3.9375 9.00039 3.9375Z" fill="currentColor" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className="text-[14px]">Try on ChatGPT</span>}
                </Link>

                {/* Get Help */}
                <Link href="/help" className={getItemClass('/help')}>
                    <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                        {/* Question Circle Icon */}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6254 5.8125C11.6254 9.02344 9.00039 11.625 5.81289 11.625C2.60195 11.625 0.000391006 9.02344 0.000391006 5.8125C0.000391006 2.625 2.60195 0 5.81289 0C9.00039 0 11.6254 2.625 11.6254 5.8125ZM5.95352 1.92188C4.68789 1.92188 3.86758 2.46094 3.23477 3.42188C3.14102 3.5625 3.16445 3.72656 3.28164 3.82031L4.10195 4.42969C4.21914 4.52344 4.40664 4.5 4.50039 4.38281C4.92227 3.84375 5.20352 3.53906 5.83633 3.53906C6.30508 3.53906 6.91445 3.84375 6.91445 4.3125C6.91445 4.66406 6.60977 4.85156 6.14102 5.10938C5.60195 5.41406 4.87539 5.78906 4.87539 6.75V6.84375C4.87539 7.00781 4.99258 7.125 5.15664 7.125H6.46914C6.60977 7.125 6.75039 7.00781 6.75039 6.84375V6.82031C6.75039 6.16406 8.6957 6.14062 8.6957 4.3125C8.6957 2.95312 7.28945 1.92188 5.95352 1.92188ZM5.81289 7.73438C5.20352 7.73438 4.73477 8.22656 4.73477 8.8125C4.73477 9.42188 5.20352 9.89062 5.81289 9.89062C6.39883 9.89062 6.89102 9.42188 6.89102 8.8125C6.89102 8.22656 6.39883 7.73438 5.81289 7.73438Z" fill="currentColor" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className="text-[14px]">Get Help</span>}
                </Link>

                {/* Settings */}
                <Link href="/icp" className={getItemClass('/icp')}>
                    <div className="w-4 h-4 flex items-center justify-center text-[#4b5563]">
                        {/* Cog Icon */}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.016 7.26562C11.1332 7.33594 11.1801 7.47656 11.1566 7.59375C10.8754 8.4375 10.4535 9.1875 9.86758 9.82031C9.77383 9.91406 9.6332 9.9375 9.51602 9.86719L8.5082 9.30469C8.08633 9.65625 7.61758 9.9375 7.10195 10.125V11.2734C7.10195 11.3906 7.0082 11.5078 6.86758 11.5547C6.04727 11.7188 5.18008 11.7422 4.31289 11.5547C4.1957 11.5078 4.10195 11.3906 4.10195 11.2734V10.125C3.56289 9.9375 3.09414 9.65625 2.67227 9.30469L1.66445 9.86719C1.54727 9.9375 1.40664 9.91406 1.31289 9.82031C0.750391 9.1875 0.305079 8.4375 0.047266 7.59375C0.000391006 7.47656 0.047266 7.33594 0.164454 7.26562L1.17227 6.70312C1.07852 6.14062 1.07852 5.60156 1.17227 5.03906L0.164454 4.47656C0.047266 4.40625 0.000391006 4.26562 0.047266 4.14844C0.305079 3.30469 0.750391 2.55469 1.31289 1.92188C1.40664 1.82812 1.54727 1.80469 1.66445 1.875L2.67227 2.46094C3.09414 2.08594 3.56289 1.80469 4.10195 1.61719V0.46875C4.10195 0.351562 4.17227 0.234375 4.31289 0.210938C5.1332 0.0234375 6.00039 0 6.86758 0.210938C7.0082 0.234375 7.10195 0.351562 7.10195 0.46875V1.61719C7.61758 1.80469 8.08633 2.08594 8.5082 2.4375L9.51602 1.875C9.6332 1.80469 9.77383 1.82812 9.86758 1.92188C10.4301 2.55469 10.8754 3.30469 11.1332 4.14844C11.1801 4.26562 11.1332 4.40625 11.016 4.47656L10.0082 5.03906C10.1254 5.60156 10.1254 6.14062 10.0082 6.70312L11.016 7.26562ZM5.60195 7.73438C6.6332 7.73438 7.47695 6.91406 7.47695 5.85938C7.47695 4.82812 6.6332 3.98438 5.60195 3.98438C4.54727 3.98438 3.72695 4.82812 3.72695 5.85938C3.72695 6.91406 4.54727 7.73438 5.60195 7.73438Z" fill="currentColor" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className="text-[14px]">Settings</span>}
                </Link>
            </div>
        </div>
    );
}
