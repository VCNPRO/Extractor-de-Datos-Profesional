
import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLightMode?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isLightMode }) => {
    if (!isOpen) return null;

    const cardBg = isLightMode ? '#ffffff' : '#1e293b';
    const textColor = isLightMode ? '#1e3a8a' : '#f1f5f9';
    const borderColor = isLightMode ? '#dbeafe' : '#475569';

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
                style={{
                    backgroundColor: cardBg,
                    color: textColor,
                    border: `1px solid ${borderColor}`
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b" style={{ borderColor: borderColor }}>
                    <h2 className="text-xl font-bold">Configuración y Cumplimiento</h2>
                </div>
                <div className="p-6">
                    <p>Aquí se mostrará la información de configuración y cumplimiento.</p>
                </div>
                <div className="p-4 border-t flex justify-end" style={{ borderColor: borderColor }}>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg transition-all"
                        style={{
                            backgroundColor: isLightMode ? '#2563eb' : '#06b6d4',
                            color: '#ffffff'
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
