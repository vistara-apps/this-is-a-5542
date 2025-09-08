import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

/**
 * Analyze contacts and generate priority scores using AI
 */
export const analyzeContactPriority = async (contacts, userContext = {}) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback prioritization');
      return fallbackPrioritization(contacts);
    }

    const contactsData = contacts.map(contact => ({
      id: contact.contactId,
      name: contact.displayName,
      relationship: contact.relationship || 'unknown',
      lastInteraction: contact.lastInteraction,
      interactionFrequency: contact.interactionFrequency || 0,
      mutualConnections: contact.mutualConnections || 0,
      tags: contact.tags || [],
      currentPriorityScore: contact.priorityScore || 0
    }));

    const prompt = `
You are an AI assistant that helps prioritize social network contacts based on relationship strength and communication patterns.

User Context:
- Total contacts: ${contacts.length}
- User preferences: ${JSON.stringify(userContext)}

Contact Data:
${JSON.stringify(contactsData, null, 2)}

Please analyze these contacts and assign priority scores (0-100) based on:
1. Relationship strength (mutual follows, interaction frequency)
2. Recency of interactions
3. Professional/personal importance indicators
4. Communication patterns

Return a JSON array with contactId and priorityScore for each contact, ordered by priority (highest first).
Include a brief explanation for the top 5 priorities.

Format:
{
  "prioritizedContacts": [
    {"contactId": "id", "priorityScore": 95, "reasoning": "explanation"},
    ...
  ],
  "summary": "Brief explanation of prioritization strategy used"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes social network data to prioritize contacts for better communication management."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;

  } catch (error) {
    console.error('Error in AI contact prioritization:', error);
    return fallbackPrioritization(contacts);
  }
};

/**
 * Generate smart group suggestions based on contact analysis
 */
export const suggestContactGroups = async (contacts) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return fallbackGroupSuggestions(contacts);
    }

    const contactsData = contacts.map(contact => ({
      id: contact.contactId,
      name: contact.displayName,
      relationship: contact.relationship,
      tags: contact.tags || [],
      interactionPatterns: contact.interactionPatterns || {},
      mutualConnections: contact.mutualConnections || 0
    }));

    const prompt = `
Analyze these contacts and suggest 3-5 smart groups that would help organize them effectively:

Contacts:
${JSON.stringify(contactsData, null, 2)}

Consider grouping by:
- Professional relationships (colleagues, clients, industry contacts)
- Personal relationships (close friends, family, acquaintances)
- Interest-based groups (shared hobbies, communities)
- Interaction patterns (frequent contacts, occasional contacts)
- Geographic or event-based connections

Return JSON format:
{
  "suggestedGroups": [
    {
      "name": "Group Name",
      "description": "Why this group makes sense",
      "suggestedContacts": ["contactId1", "contactId2"],
      "groupType": "professional|personal|interest|frequency"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes social connections to suggest meaningful contact groups."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;

  } catch (error) {
    console.error('Error in AI group suggestions:', error);
    return fallbackGroupSuggestions(contacts);
  }
};

/**
 * Generate personalized message suggestions for contacts
 */
export const generateMessageSuggestions = async (contact, context = {}) => {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return fallbackMessageSuggestions(contact);
    }

    const prompt = `
Generate 3 personalized message suggestions for reaching out to this contact:

Contact Info:
- Name: ${contact.displayName}
- Relationship: ${contact.relationship || 'connection'}
- Last interaction: ${contact.lastInteraction || 'unknown'}
- Tags: ${contact.tags?.join(', ') || 'none'}
- Context: ${JSON.stringify(context)}

Generate messages that are:
1. Personalized and relevant
2. Appropriate for the relationship level
3. Engaging but not pushy
4. Different tones (professional, casual, friendly)

Return JSON format:
{
  "suggestions": [
    {
      "message": "message text",
      "tone": "professional|casual|friendly",
      "reasoning": "why this message works"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates personalized, appropriate messages for social networking."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;

  } catch (error) {
    console.error('Error generating message suggestions:', error);
    return fallbackMessageSuggestions(contact);
  }
};

/**
 * Fallback prioritization when AI is not available
 */
const fallbackPrioritization = (contacts) => {
  const prioritizedContacts = contacts.map(contact => {
    let score = 50; // Base score
    
    // Boost for recent interactions
    if (contact.lastInteraction) {
      const daysSinceInteraction = (Date.now() - new Date(contact.lastInteraction)) / (1000 * 60 * 60 * 24);
      if (daysSinceInteraction < 7) score += 20;
      else if (daysSinceInteraction < 30) score += 10;
    }
    
    // Boost for mutual connections
    if (contact.relationship === 'mutual') score += 15;
    else if (contact.relationship === 'following') score += 10;
    
    // Boost for interaction frequency
    score += Math.min((contact.interactionFrequency || 0) * 2, 20);
    
    // Random factor for variety
    score += Math.random() * 10;
    
    return {
      contactId: contact.contactId,
      priorityScore: Math.min(Math.round(score), 100),
      reasoning: "Algorithmic scoring based on interaction patterns and relationship strength"
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    prioritizedContacts,
    summary: "Contacts prioritized using algorithmic scoring based on interaction frequency, relationship type, and recency."
  };
};

/**
 * Fallback group suggestions when AI is not available
 */
const fallbackGroupSuggestions = (contacts) => {
  const groups = [];
  
  // Group by relationship type
  const mutualFollows = contacts.filter(c => c.relationship === 'mutual');
  const following = contacts.filter(c => c.relationship === 'following');
  const followers = contacts.filter(c => c.relationship === 'follower');
  
  if (mutualFollows.length > 0) {
    groups.push({
      name: "Close Connections",
      description: "Mutual followers - your strongest network connections",
      suggestedContacts: mutualFollows.slice(0, 10).map(c => c.contactId),
      groupType: "relationship"
    });
  }
  
  if (following.length > 0) {
    groups.push({
      name: "Following",
      description: "People you follow - potential collaborators and interests",
      suggestedContacts: following.slice(0, 15).map(c => c.contactId),
      groupType: "relationship"
    });
  }
  
  // Group by interaction frequency
  const frequentContacts = contacts
    .filter(c => (c.interactionFrequency || 0) > 5)
    .slice(0, 8);
    
  if (frequentContacts.length > 0) {
    groups.push({
      name: "Frequent Contacts",
      description: "People you interact with regularly",
      suggestedContacts: frequentContacts.map(c => c.contactId),
      groupType: "frequency"
    });
  }
  
  return { suggestedGroups: groups };
};

/**
 * Fallback message suggestions when AI is not available
 */
const fallbackMessageSuggestions = (contact) => {
  const suggestions = [
    {
      message: `Hey ${contact.displayName}! Hope you're doing well. Would love to catch up sometime.`,
      tone: "casual",
      reasoning: "Friendly and casual reconnection message"
    },
    {
      message: `Hi ${contact.displayName}, I came across something that reminded me of our previous conversations. How have you been?`,
      tone: "friendly",
      reasoning: "Personal touch referencing past interactions"
    },
    {
      message: `Hello ${contact.displayName}, I hope this message finds you well. I'd be interested in connecting and learning more about what you're working on.`,
      tone: "professional",
      reasoning: "Professional networking approach"
    }
  ];
  
  return { suggestions };
};
