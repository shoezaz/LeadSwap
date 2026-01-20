import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    isRegisterModalOpen: boolean;
    openRegisterModal: (file?: File) => void;
    closeRegisterModal: () => void;
    registerFile: File | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [registerFile, setRegisterFile] = useState<File | null>(null);

    const openRegisterModal = (file?: File) => {
        setRegisterFile(file || null);
        setIsRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
        setRegisterFile(null);
    };

    return (
        <ModalContext.Provider value={{
            isRegisterModalOpen,
            openRegisterModal,
            closeRegisterModal,
            registerFile
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
