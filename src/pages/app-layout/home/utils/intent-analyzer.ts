export enum UserIntent {
  RECOMMENDATION = 'recommendation',
  SEARCH = 'search',
  COMPARISON = 'comparison',
  IMPLEMENTATION = 'implementation',
  COST_ANALYSIS = 'cost_analysis',
  TRENDS = 'trends',
  STACK_BUILDER = 'stack_builder',
  GENERAL = 'general'
}

export function analyzeUserIntent(message: string): UserIntent {
  const lowerMessage = message.toLowerCase();
  
  // Check for recommendation intent
  if (
    lowerMessage.includes('recommend') || 
    lowerMessage.includes('suggest') || 
    lowerMessage.includes('need') ||
    (lowerMessage.includes('best') && lowerMessage.includes('tool')) ||
    lowerMessage.includes('for my project') || 
    lowerMessage.includes('for a')
  ) {
    return UserIntent.RECOMMENDATION;
  }
  
  // Check for comparison intent
  if (
    lowerMessage.includes('compare') || 
    lowerMessage.includes('vs') || 
    lowerMessage.includes('versus') ||
    lowerMessage.includes('difference between')
  ) {
    return UserIntent.COMPARISON;
  }
  
  // Check for search intent
  if (
    lowerMessage.includes('find') || 
    lowerMessage.includes('search') || 
    lowerMessage.includes('show') || 
    lowerMessage.includes('list') ||
    lowerMessage.includes('looking for')
  ) {
    return UserIntent.SEARCH;
  }
  
  // Check for implementation analysis
  if (
    lowerMessage.includes('implementation') && 
    (lowerMessage.includes('analysis') || 
     lowerMessage.includes('complexity') || 
     lowerMessage.includes('timeline'))
  ) {
    return UserIntent.IMPLEMENTATION;
  }
  
  // Check for cost analysis
  if (
    lowerMessage.includes('cost') && 
    (lowerMessage.includes('analysis') || 
     lowerMessage.includes('ownership') || 
     lowerMessage.includes('calculate'))
  ) {
    return UserIntent.COST_ANALYSIS;
  }
  
  // Check for trends
  if (
    lowerMessage.includes('trends') || 
    lowerMessage.includes('latest') || 
    lowerMessage.includes('popular') ||
    lowerMessage.includes('trending')
  ) {
    return UserIntent.TRENDS;
  }
  
  // Check for stack builder
  if (
    lowerMessage.includes('stack') || 
    lowerMessage.includes('setup') ||
    lowerMessage.includes('build a complete')
  ) {
    return UserIntent.STACK_BUILDER;
  }
  
  return UserIntent.GENERAL;
}