import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScanContextType {
  scannedBarcodes: string[];
  setScannedBarcodes: (barcodes: string[]) => void;
  addBarcode: (barcode: string) => void;
  deleteBarcode: (index: number) => void;
  clearBarcodes: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

interface ScanProviderProps {
  children: ReactNode;
}

export const ScanProvider: React.FC<ScanProviderProps> = ({ children }) => {
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);

  const addBarcode = (barcode: string) => {
    setScannedBarcodes((prev) => [...prev, barcode]);
  };

  const deleteBarcode = (index: number) => {
    setScannedBarcodes((prev) => prev.filter((_, i) => i !== index));
  };

  const clearBarcodes = () => {
    setScannedBarcodes([]);
  };

  const value: ScanContextType = {
    scannedBarcodes,
    setScannedBarcodes,
    addBarcode,
    deleteBarcode,
    clearBarcodes,
  };

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
};

export const useScan = (): ScanContextType => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};
