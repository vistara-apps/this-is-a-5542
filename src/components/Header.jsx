import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Network, MessageCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-surface shadow-card border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-textPrimary">ConnectFlow</h1>
              <p className="text-sm text-textSecondary">Smartly organize and engage your network</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-textSecondary">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Farcaster Frame</span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}