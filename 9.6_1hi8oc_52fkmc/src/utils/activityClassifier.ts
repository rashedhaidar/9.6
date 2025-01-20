import { LIFE_DOMAINS } from '../types/domains';

export function classifyActivity(title: string, description: string = ''): string {
  const text = `${title} ${description}`.toLowerCase();
  
  // Find domain with most keyword matches
  let bestMatch = {
    domainId: 'personal',
    matches: 0
  };

  LIFE_DOMAINS.forEach(domain => {
    const matches = domain.keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;

    if (matches > bestMatch.matches) {
      bestMatch = {
        domainId: domain.id,
        matches
      };
    }
  });

  return bestMatch.domainId;
}
