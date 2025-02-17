
export type PolicyView = 
  | 'privacy' | 'terms' | 'cookie' | 'legal' | 'intellectual-property'
  | 'accessibility' | 'refund' | 'shipping' | 'terms-sale' | 'ugc'
  | 'data-retention' | 'cybersecurity' | 'ai-policy' | 'california-privacy'
  | 'do-not-sell' | 'ethics' | 'anti-bribery' | 'whistleblower'
  | 'supplier-code' | 'employee-code' | 'social-media' | 'environmental'
  | 'sitemap';

export type ContentView = 
  | 'video' 
  | 'dunes' 
  | 'company' 
  | 'projects' 
  | 'gallery' 
  | 'contact' 
  | PolicyView;
