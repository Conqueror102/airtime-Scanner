import React from 'react';
import { NETWORKS, Network } from '../../types';
import { motion } from 'framer-motion';

interface NetworkSelectorProps {
  selectedNetwork: Network;
  onChange: (network: Network) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ selectedNetwork, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Select Network Provider:</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(NETWORKS) as Network[]).map((network) => (
          <motion.button
            key={network}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(network)}
            className={`${
              selectedNetwork === network 
                ? 'ring-2 ring-offset-2 ring-primary-700 bg-white shadow-md' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-70'
            } p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200`}
          >
            <div 
              className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
              style={{ backgroundColor: NETWORKS[network].color }}
            >
              <span className="text-white font-bold text-xs">
                {NETWORKS[network].name.substring(0, 1)}
              </span>
            </div>
            <span className="font-medium text-sm">{NETWORKS[network].name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;