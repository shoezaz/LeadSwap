import React from "react";

export function Header() {
    return (
        <div className="w-full h-full flex items-center justify-between px-5">
            {/* Left Group: Icon + Title */}
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#eef0f2] rounded-[6px] flex items-center justify-center">
                    {/* User provided SVG 1: Likely 'Users' or Page icon */}
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.42539 5.16289C2.99648 5.16289 1.84414 4.01055 1.84414 2.58164C1.84414 1.17578 2.99648 0.00039047 4.42539 0.00039047C5.83125 0.00039047 7.00664 1.17578 7.00664 2.58164C7.00664 4.01055 5.83125 5.16289 4.42539 5.16289ZM6.17695 5.90039C7.65195 5.90039 8.85039 7.09883 8.85039 8.57383V9.21914C8.85039 9.84141 8.34336 10.3254 7.74414 10.3254H1.10664C0.484375 10.3254 0.000391006 9.84141 0.000391006 9.21914V8.57383C0.000391006 7.09883 1.17578 5.90039 2.65078 5.90039H2.83516C3.31914 6.13086 3.84922 6.26914 4.42539 6.26914C4.97852 6.26914 5.50859 6.13086 5.99258 5.90039H6.17695ZM11.0629 5.16289C9.84141 5.16289 8.85039 4.17187 8.85039 2.95039C8.85039 1.72891 9.84141 0.73789 11.0629 0.73789C12.2844 0.73789 13.2754 1.72891 13.2754 2.95039C13.2754 4.17187 12.2844 5.16289 11.0629 5.16289ZM12.1691 5.90039C13.575 5.90039 14.7504 7.07578 14.7504 8.48164C14.7504 9.10391 14.2434 9.58789 13.6441 9.58789H9.56484C9.56484 9.5418 9.58789 9.4957 9.58789 9.44961V8.57383C9.58789 7.675 9.21914 6.86836 8.66602 6.26914C9.03477 6.03867 9.47266 5.90039 9.95664 5.90039H10.0258C10.3484 6.01562 10.6941 6.08477 11.0629 6.08477C11.4086 6.08477 11.7543 6.01562 12.077 5.90039H12.1691Z" fill="#4B5563" />
                    </svg>
                </div>
                <span className="font-medium text-[#10161e] text-[16px]">List</span>
            </div>

            {/* Right Group: Buttons + Avatar */}
            <div className="flex items-center gap-2">
                {/* Search Button (Closed) */}
                <button className="w-7 h-7 flex items-center justify-center bg-white rounded-[6px] shadow-[0px_0px_2px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02),inset_0px_0px_0px_1px_#EEF0F2] transition-colors hover:bg-gray-50">
                    {/* Using a generic search icon here as provided SVGs might not be it, or maybe Svg 3? 
                Let's use a standard search SVG to be safe, or check if Svg 3 fits.
                Svg 3 looks like a briefcase/folder based on path. 
                I will use a simple magnifier SVG for now matching the style. 
            */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>



                {/* Briefcase Button */}
                <button className="w-7 h-7 flex items-center justify-center bg-white rounded-[6px] shadow-[0px_0px_2px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02),inset_0px_0px_0px_1px_#EEF0F2] transition-colors hover:bg-gray-50">
                    {/* User provided SVG 3: Briefcase/Archive */}
                    <svg width="14" height="14" viewBox="2 11 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.68789 11.675H9.53164C9.83125 11.675 10.0848 11.9285 10.0848 12.2281V16.1H12.0898C12.5047 16.1 12.7121 16.607 12.4125 16.9066L8.90938 20.4098C8.74805 20.5711 8.44844 20.5711 8.28711 20.4098L4.78398 16.9066C4.48438 16.607 4.6918 16.1 5.10664 16.1H7.13477V12.2281C7.13477 11.9285 7.36523 11.675 7.68789 11.675ZM14.5098 20.3406V22.9219C14.5098 23.2445 14.2563 23.475 13.9566 23.475H3.26289C2.94023 23.475 2.70977 23.2445 2.70977 22.9219V20.3406C2.70977 20.041 2.94023 19.7875 3.26289 19.7875H6.62773L7.75703 20.9168C8.21797 21.4008 8.97852 21.4008 9.43945 20.9168L10.5688 19.7875H13.9566C14.2563 19.7875 14.5098 20.041 14.5098 20.3406ZM11.652 22.3688C11.652 22.1152 11.4445 21.9078 11.191 21.9078C10.9375 21.9078 10.7301 22.1152 10.7301 22.3688C10.7301 22.6223 10.9375 22.8297 11.191 22.8297C11.4445 22.8297 11.652 22.6223 11.652 22.3688ZM13.127 22.3688C13.127 22.1152 12.9195 21.9078 12.666 21.9078C12.4125 21.9078 12.2051 22.1152 12.2051 22.3688C12.2051 22.6223 12.4125 22.8297 12.666 22.8297C12.9195 22.8297 13.127 22.6223 13.127 22.3688Z" fill="#4B5563" />
                    </svg>
                </button>

                {/* Avatar (Placeholder) */}
                <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden ml-1">
                    <img src="https://via.placeholder.com/28" alt="User" />
                </div>
            </div>
        </div>
    );
}
