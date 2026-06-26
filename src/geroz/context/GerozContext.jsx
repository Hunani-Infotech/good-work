import { createContext, useContext, useState } from 'react';

const GerozContext = createContext(undefined);

export function GerozContextProvider({ children }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const toggleVideoModal = () => setIsVideoModalOpen((open) => !open);

  const renderCircleText = (text) =>
    text.split('').map((char, i) => (
      <span key={i} style={{ transform: `rotate(${i * 9.1}deg)` }}>
        {char}
      </span>
    ));

  return (
    <GerozContext.Provider
      value={{
        renderCircleText,
        isVideoModalOpen,
        toggleVideoModal,
      }}
    >
      {children}
    </GerozContext.Provider>
  );
}

export function useGerozContext() {
  const context = useContext(GerozContext);
  if (!context) {
    throw new Error('useGerozContext must be used within a GerozContextProvider');
  }
  return context;
}

/** Alias used by ported Geroz section components. */
export const useCustomContext = useGerozContext;
