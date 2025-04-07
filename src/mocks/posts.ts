export interface Post {
  id: string;
  userId: string;
  rawContent: string;
  processedContent: {
    linkedin?: string;
    twitter?: string;
  };
  status: 'draft' | 'published';
  platforms: ('linkedin' | 'twitter')[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    rawContent: 'Just had a breakthrough on our new product design. Amazing how a simple change in perspective can solve complex problems.',
    processedContent: {
      linkedin: "Exciting news! 🚀 Just had a major breakthrough on our new product design. It's remarkable how a simple shift in perspective can solve seemingly complex problems.\n\nThis reminds me why design thinking is so crucial in product development - sometimes the solution isn't adding more complexity, but finding the elegant simplicity within the problem.\n\n#ProductDesign #Innovation #DesignThinking #Entrepreneurship",
      twitter: "Had a major breakthrough on our new product design today! 💡 Amazing how shifting perspective can solve complex problems. Sometimes innovation isn't about adding complexity, but finding the elegant simplicity within. #ProductDesign #Innovation",
    },
    status: 'published',
    platforms: ['linkedin', 'twitter'],
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T11:45:00Z',
    publishedAt: '2023-04-15T11:50:00Z',
  },
  {
    id: '2',
    userId: '1',
    rawContent: 'Team collaboration is the key to our success. Today we implemented a new communication system that will revolutionize how we work together.',
    processedContent: {
      linkedin: "I'm thrilled to announce that our team has just implemented a new communication system that will transform how we collaborate! 🔄\n\nEffective team collaboration has always been the cornerstone of our success, and this new tool will take us to the next level by streamlining information sharing and reducing the friction in our daily interactions.\n\nWhat communication tools have revolutionized your team's workflow?\n\n#TeamCollaboration #Communication #ProductivityTools #Leadership",
      twitter: "Just implemented a new team communication system that's going to revolutionize our workflow! 🚀 Effective collaboration has always been our secret sauce, and this takes it to the next level. What tools have transformed your team's productivity? #TeamCollaboration",
    },
    status: 'published',
    platforms: ['linkedin', 'twitter'],
    createdAt: '2023-04-20T09:15:00Z',
    updatedAt: '2023-04-20T09:45:00Z',
    publishedAt: '2023-04-20T10:00:00Z',
  },
  {
    id: '3',
    userId: '1',
    rawContent: 'Market research is showing positive trends for our industry. Planning to capitalize on these opportunities in Q3.',
    processedContent: {
      linkedin: "I've been analyzing recent market research, and I'm excited to share that our industry is showing extremely positive trends! 📈\n\nThese findings are informing our strategic planning for Q3, where we'll be positioning ourselves to capitalize on these emerging opportunities.\n\nAs leaders, it's crucial that we remain vigilant about market shifts and agile in our response strategies.\n\nHow is your organization planning to leverage current market opportunities?\n\n#MarketResearch #StrategicPlanning #BusinessGrowth #Leadership",
    },
    status: 'published',
    platforms: ['linkedin'],
    createdAt: '2023-04-25T14:20:00Z',
    updatedAt: '2023-04-25T14:50:00Z',
    publishedAt: '2023-04-25T15:10:00Z',
  },
  {
    id: '4',
    userId: '1',
    rawContent: 'Excited to announce we\'re expanding our team! Looking for talented individuals passionate about innovation and customer experience.',
    processedContent: {
      linkedin: "🎉 Exciting News: We're Growing Our Team! 🎉\n\nI'm thrilled to announce that we're expanding and on the lookout for talented individuals who are passionate about innovation and delivering exceptional customer experiences.\n\nAs we continue to scale, we're committed to building a diverse team that brings fresh perspectives and ideas to the table.\n\nIf you or someone you know is looking for an opportunity to make a real impact in a dynamic environment, check out our careers page (link in comments).\n\n#WeAreHiring #JobOpportunity #Innovation #CustomerExperience",
      twitter: "🚨 We're hiring! 🚨 Looking for talented people passionate about innovation and customer experience to join our growing team. Excited to welcome new perspectives as we scale! DM for details. #WeAreHiring #JobOpportunity"
    },
    status: 'published',
    platforms: ['linkedin', 'twitter'],
    createdAt: '2023-05-02T08:30:00Z',
    updatedAt: '2023-05-02T10:15:00Z',
    publishedAt: '2023-05-02T11:00:00Z',
  },
  {
    id: '5',
    userId: '1',
    rawContent: 'Our new sustainability initiative is launching next month. Can\'t wait to share how we\'re reducing our environmental impact.',
    processedContent: {
      linkedin: "I'm incredibly proud to announce that our team will be launching a comprehensive sustainability initiative next month! 🌱\n\nThis project represents months of hard work and reflects our deep commitment to reducing our environmental footprint while creating lasting value for our stakeholders.\n\nWe've set ambitious goals for carbon reduction, waste management, and sustainable sourcing that will transform how we operate.\n\nStay tuned for the full announcement where we'll share our roadmap and the measurable impacts we expect to achieve.\n\n#Sustainability #EnvironmentalImpact #CorporateResponsibility #GreenBusiness",
    },
    status: 'draft',
    platforms: ['linkedin'],
    createdAt: '2023-05-10T13:45:00Z',
    updatedAt: '2023-05-10T15:20:00Z',
  },
  {
    id: '6',
    userId: '1',
    rawContent: 'Just finished reading an insightful book on leadership strategies. Here are my key takeaways that could benefit your team.',
    processedContent: {
      twitter: "Just finished a game-changing book on leadership! 📚 Top 3 takeaways:\n1. Create psychological safety\n2. Lead with questions, not answers\n3. Balance empathy with accountability\n\nWhich of these resonates with you? #Leadership #PersonalDevelopment"
    },
    status: 'published',
    platforms: ['twitter'],
    createdAt: '2023-05-15T19:30:00Z',
    updatedAt: '2023-05-15T20:45:00Z',
    publishedAt: '2023-05-15T21:00:00Z',
  }
];

// Helper function to get drafts
export const getDrafts = () => mockPosts.filter(post => post.status === 'draft');

// Helper function to get published posts
export const getPublishedPosts = () => mockPosts.filter(post => post.status === 'published'); 