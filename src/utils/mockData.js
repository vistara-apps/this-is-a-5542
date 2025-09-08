// Mock Farcaster contact data generator
export function generateMockContacts(count = 50) {
  const names = [
    'Alex Chen', 'Jordan Smith', 'Taylor Kim', 'Casey Johnson', 'Morgan Davis',
    'Riley Brown', 'Avery Wilson', 'Quinn Garcia', 'Blake Martinez', 'Sage Thompson',
    'River Lopez', 'Skyler Anderson', 'Rowan Jackson', 'Phoenix Lee', 'Harper Clark',
    'Ember Rodriguez', 'Dakota Williams', 'Kai Miller', 'Nova Torres', 'Zion Adams',
    'Luna Garcia', 'Atlas Rivera', 'Orion Walker', 'Sage Cooper', 'River Hayes',
    'Storm Bailey', 'Ash Turner', 'Indigo Ross', 'Echo Peterson', 'Vale Murphy'
  ];

  const tags = [
    'Developer', 'Designer', 'Crypto', 'DeFi', 'NFT', 'Web3', 'Builder', 'Founder',
    'Investor', 'Creator', 'Artist', 'Writer', 'Researcher', 'Community', 'Marketing',
    'Product', 'Engineering', 'Strategy', 'Growth', 'Analytics', 'Close Friend',
    'Colleague', 'Mentor', 'Student', 'Partner', 'Client', 'Advisor', 'Team Member'
  ];

  const contacts = [];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const username = name.toLowerCase().replace(' ', '');
    const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);
    
    contacts.push({
      contactId: i + 1,
      userId: 'current-user',
      farcasterUserId: username + Math.floor(Math.random() * 1000),
      displayName: name,
      priorityScore: Math.floor(Math.random() * 100) + 1,
      tags: randomTags,
      lastInteraction: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random within last 30 days
      interactionCount: Math.floor(Math.random() * 50) + 1,
      isFollowing: Math.random() > 0.3,
      isFollower: Math.random() > 0.2
    });
  }

  return contacts;
}

// Mock AI prioritization service
export async function prioritizeContacts(contacts) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple prioritization algorithm based on interaction patterns
  return contacts.map(contact => ({
    ...contact,
    priorityScore: calculatePriorityScore(contact)
  })).sort((a, b) => b.priorityScore - a.priorityScore);
}

function calculatePriorityScore(contact) {
  let score = 0;
  
  // Base interaction score
  score += contact.interactionCount * 2;
  
  // Recency bonus
  const daysSinceLastInteraction = (Date.now() - contact.lastInteraction) / (1000 * 60 * 60 * 24);
  if (daysSinceLastInteraction < 7) score += 20;
  else if (daysSinceLastInteraction < 30) score += 10;
  
  // Mutual following bonus
  if (contact.isFollowing && contact.isFollower) score += 15;
  
  // Tag-based scoring
  const highValueTags = ['Close Friend', 'Mentor', 'Partner', 'Founder', 'Investor'];
  const hasHighValueTag = contact.tags.some(tag => highValueTags.includes(tag));
  if (hasHighValueTag) score += 25;
  
  return Math.min(100, Math.max(1, score));
}