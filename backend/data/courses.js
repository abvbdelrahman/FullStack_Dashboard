const courses = [
  {
    id: 1,
    title: 'Create High-Fidelity Designs and Prototypes in Figma',
    description:
      'This is your path to building and managing high-quality UX course content for professional learning programs.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    instructor: {
      name: 'Sahed Kawser',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'UX/UI Designer',
    },
    duration: '40 Minutes to complete',
    modules: '29 Module in courses',
    rating: 4.8,
    reviews: 5598,
    price: 29,
    whatYouLearn: [
      'Improve the design skill and understanding design theory.',
      'Improve the design skill and understanding design theory.',
      'Improve the design skill and understanding design theory.',
      'Improve the design skill and understanding design theory.',
    ],
    materialIncludes: [
      '12 hours on-demand video',
      'Full lifetime access',
      'Access on mobile and Tv',
      '1 downloadable resource',
    ],
    requirements: [
      'Use this course setup to organize structured lessons and resources.',
    ],
    tags: ['ui/ux', 'design', 'user interface'],
    audience: 'Designed for instructors and admins managing learning content.',
    sections: [
      {
        title: 'UX/UI Introduction',
        items: [
          {
            title: 'Introduction',
            label: 'Introduction',
            description: 'Overview of the course workflow and expected outcomes.',
            duration: '05:34',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            type: 'video',
            isPreview: true,
            resources: [],
          },
          {
            title: 'Practice file',
            label: 'Practice file',
            description: 'Download and prepare the starter file for hands-on work.',
            duration: '00:00',
            videoUrl: '',
            type: 'article',
            isPreview: false,
            resources: [],
          },
        ],
      },
      { title: 'Section 1', items: [] },
      { title: 'Section 2', items: [] },
      { title: 'Section 3', items: [] },
      { title: 'Section 4', items: [] },
      { title: 'Section 5', items: [] },
    ],
  },

  {
    id: 2,
    title: 'Fullstack Web Development',
    description:
      'Master frontend and backend technologies to build scalable applications.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    instructor: {
      name: 'Sarah Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'Fullstack Instructor',
    },
    duration: '48 Minutes to complete',
    modules: '32 Module in courses',
    rating: 4.7,
    reviews: 4800,
    price: 39,
    whatYouLearn: [
      'Build responsive web applications.',
      'Learn both frontend and backend workflows.',
      'Deploy fullstack apps to production.',
    ],
    materialIncludes: [
      '16 hours on-demand video',
      'Full lifetime access',
      'Access on mobile and Tv',
      '2 downloadable resources',
    ],
    requirements: [
      'Basic JavaScript knowledge is helpful.',
    ],
    tags: ['web', 'development', 'fullstack'],
    audience: 'Perfect for aspiring fullstack developers.',
    sections: [
      { title: 'Getting Started', items: [] },
      { title: 'Frontend Basics', items: [] },
      { title: 'Backend Fundamentals', items: [] },
    ],
  },

  {
    id: 3,
    title: 'Digital Marketing Strategy',
    description:
      'Understand SEO, social media marketing, and paid advertising campaigns.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    instructor: {
      name: 'Michael Lee',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      role: 'Marketing Expert',
    },
    duration: '30 Minutes to complete',
    modules: '18 Module in courses',
    rating: 4.6,
    reviews: 3800,
    price: 25,
    whatYouLearn: [
      'Launch campaigns with confidence.',
      'Track ROI and audience engagement.',
      'Create content that converts.',
    ],
    materialIncludes: [
      '10 hours on-demand video',
      'Full lifetime access',
      'Access on mobile and Tv',
      '1 downloadable resource',
    ],
    requirements: [
      'No prior marketing experience required.',
    ],
    tags: ['marketing', 'seo', 'strategy'],
    audience: 'Ideal for beginners and business owners.',
    sections: [
      { title: 'Marketing Overview', items: [] },
      { title: 'Campaign Planning', items: [] },
    ],
  },
  {
  id: 4,
  title: 'Data Science & Machine Learning',
  description:
    'Learn data analysis, visualization, machine learning algorithms, and predictive modeling.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  instructor: {
    name: 'Emily Davis',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Data Scientist',
  },
  duration: '55 Minutes to complete',
  modules: '35 Module in courses',
  rating: 4.9,
  reviews: 6200,
  price: 49,
  whatYouLearn: [
    'Data cleaning and preprocessing.',
    'Machine learning fundamentals.',
    'Data visualization techniques.',
  ],
  materialIncludes: [
    '18 hours on-demand video',
    'Full lifetime access',
    'Datasets and exercises',
  ],
  requirements: ['Basic Python knowledge recommended.'],
  tags: ['data science', 'machine learning', 'python'],
  audience: 'Students and aspiring data analysts.',
  sections: [
    { title: 'Introduction to Data Science', items: [] },
    { title: 'Machine Learning Basics', items: [] },
  ],
},

{
  id: 5,
  title: 'Project Management Professional',
  description:
    'Master project planning, execution, team management, and agile methodologies.',
  image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
  instructor: {
    name: 'David Brown',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    role: 'Project Manager',
  },
  duration: '42 Minutes to complete',
  modules: '24 Module in courses',
  rating: 4.7,
  reviews: 4200,
  price: 34,
  whatYouLearn: [
    'Project lifecycle management.',
    'Agile and Scrum principles.',
    'Team communication skills.',
  ],
  materialIncludes: [
    '14 hours on-demand video',
    'Certificate of completion',
  ],
  requirements: ['No prior experience required.'],
  tags: ['project management', 'agile', 'scrum'],
  audience: 'Future project managers and team leaders.',
  sections: [
    { title: 'Project Fundamentals', items: [] },
    { title: 'Agile Frameworks', items: [] },
  ],
},

{
  id: 6,
  title: 'Advanced React Development',
  description:
    'Build scalable React applications using hooks, context, routing, and performance optimization.',
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  instructor: {
    name: 'James Walker',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    role: 'Frontend Engineer',
  },
  duration: '50 Minutes to complete',
  modules: '28 Module in courses',
  rating: 4.8,
  reviews: 5100,
  price: 45,
  whatYouLearn: [
    'Advanced React Hooks.',
    'State management patterns.',
    'Performance optimization.',
  ],
  materialIncludes: [
    '15 hours on-demand video',
    'Source code included',
  ],
  requirements: ['Basic React knowledge.'],
  tags: ['react', 'frontend', 'javascript'],
  audience: 'Frontend developers.',
  sections: [
    { title: 'React Fundamentals Review', items: [] },
    { title: 'Advanced Patterns', items: [] },
  ],
},

{
  id: 7,
  title: 'Cybersecurity Fundamentals',
  description:
    'Learn how to protect systems, networks, and applications from cyber threats.',
  image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87',
  instructor: {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    role: 'Security Engineer',
  },
  duration: '38 Minutes to complete',
  modules: '20 Module in courses',
  rating: 4.6,
  reviews: 3100,
  price: 32,
  whatYouLearn: [
    'Network security basics.',
    'Common attack vectors.',
    'Security best practices.',
  ],
  materialIncludes: [
    '12 hours on-demand video',
    'Practice labs',
  ],
  requirements: ['Basic computer knowledge.'],
  tags: ['security', 'cybersecurity', 'networking'],
  audience: 'IT professionals and beginners.',
  sections: [
    { title: 'Cybersecurity Overview', items: [] },
    { title: 'Threat Detection', items: [] },
  ],
},

{
  id: 8,
  title: 'Mobile App Development with Flutter',
  description:
    'Build beautiful cross-platform mobile applications using Flutter and Dart.',
  image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
  instructor: {
    name: 'Sophia Martin',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    role: 'Mobile Developer',
  },
  duration: '46 Minutes to complete',
  modules: '26 Module in courses',
  rating: 4.8,
  reviews: 4500,
  price: 41,
  whatYouLearn: [
    'Flutter widgets.',
    'State management.',
    'Publishing mobile apps.',
  ],
  materialIncludes: [
    '17 hours on-demand video',
    'Project source code',
  ],
  requirements: ['Basic programming knowledge.'],
  tags: ['flutter', 'mobile', 'dart'],
  audience: 'Developers interested in mobile apps.',
  sections: [
    { title: 'Flutter Basics', items: [] },
    { title: 'Building Real Apps', items: [] },
  ],
},
];

export default courses;
