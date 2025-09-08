import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Header } from './components/Header';
import { ContactList } from './components/ContactList';
import { ContactGroups } from './components/ContactGroups';
import { StatsCards } from './components/StatsCards';
import { usePaymentContext } from './hooks/usePaymentContext';
import { generateMockContacts } from './utils/mockData';

function App() {
  const { isConnected } = useAccount();
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasPaidForPrioritization, setHasPaidForPrioritization] = useState(false);

  const { createSession } = usePaymentContext();

  useEffect(() => {
    if (isConnected) {
      // Generate mock Farcaster contacts when wallet is connected
      const mockContacts = generateMockContacts(50);
      setContacts(mockContacts);
    }
  }, [isConnected]);

  const handlePrioritizeContacts = async () => {
    try {
      await createSession();
      setHasPaidForPrioritization(true);
      
      // Simulate AI prioritization by sorting contacts by interaction score
      const prioritizedContacts = [...contacts].sort((a, b) => b.priorityScore - a.priorityScore);
      setContacts(prioritizedContacts);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleCreateGroup = async (groupName, selectedContacts) => {
    try {
      await createSession();
      
      const newGroup = {
        groupId: Date.now(),
        name: groupName,
        description: `Group with ${selectedContacts.length} contacts`,
        createdAt: new Date(),
        contacts: selectedContacts
      };
      
      setGroups([...groups, newGroup]);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.displayName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGroup ? selectedGroup.contacts.some(c => c.contactId === contact.contactId) : true)
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">ConnectFlow</h1>
            <p className="text-xl text-gray-300">Smartly organize and engage your network</p>
          </div>
          <div className="glass-effect rounded-lg p-6 space-y-4">
            <p className="text-gray-300">Connect your wallet to start managing your Farcaster contacts</p>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards 
          totalContacts={contacts.length}
          totalGroups={groups.length}
          hasPaidForPrioritization={hasPaidForPrioritization}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contact Groups Sidebar */}
          <div className="lg:col-span-1">
            <ContactGroups 
              groups={groups}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
              contacts={contacts}
              onCreateGroup={handleCreateGroup}
            />
          </div>

          {/* Main Contact List */}
          <div className="lg:col-span-3">
            <ContactList 
              contacts={filteredContacts}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onPrioritizeContacts={handlePrioritizeContacts}
              hasPaidForPrioritization={hasPaidForPrioritization}
              selectedGroup={selectedGroup}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;