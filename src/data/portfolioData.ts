import type { PortfolioState, NavItem } from '../types/portfolio'

export const navItems: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export const initialPortfolioData: PortfolioState = {
  profileData: {
    name: 'Chandu Challa',
    monogram: 'CC',
    headerSubtitle: 'CSE • AI & ML',
    badge: 'Computer Science & Engineering (AI & ML) • Malla Reddy University',
    location: 'Suryapet & Hyderabad, Telangana, India',
    universityShort: 'Malla Reddy University',
    rolesRotator: [
      'AI & Machine Learning Engineer',
      'Computer Vision & NLP Developer',
      'Conversational AI & LLM Systems Builder',
      'Full-Stack Web & Technical Support Engineer',
    ],
    intro:
      'B.Tech graduate in Computer Science and Engineering (Artificial Intelligence and Machine Learning) from Malla Reddy University. Focused on building practical computer vision, NLP, audio classification, and conversational AI applications alongside responsive web development and systematic technical troubleshooting.',
    objective:
      'Contribute to engineering teams in entry-level AI/ML, junior web development, or technical support engineering roles where analytical problem-solving and clean implementation create immediate value.',
    aboutParagraphs: [
      'I am a Computer Science and Engineering graduate specializing in Artificial Intelligence and Machine Learning from Malla Reddy University, originally from Suryapet, Telangana. My academic work focuses on turning core programming concepts in Python, HTML5, and CSS3 into structured, working software prototypes.',
      'Through hands-on engineering labs, I have built pipelines for real-time object and theft detection using YOLO and OpenCV, toxic text span classification using machine learning, music genre classification from acoustic waveforms, and conversational AI interfaces powered by LangChain and Streamlit.',
      'Beyond development, I enjoy troubleshooting Windows environment PATH configurations, isolating Python virtual environment conflicts, and organizing structured datasets in Microsoft Excel.',
    ],
    highlights: [
      { label: 'Institution', value: 'Malla Reddy University', detail: 'B.Tech CSE (AI & ML)' },
      { label: 'AI/ML Prototypes', value: '4 Core Systems', detail: 'Vision, NLP, Audio & AI Chat' },
      { label: 'Core Stack', value: 'Python & Modern Web', detail: 'HTML5, CSS3 & Streamlit' },
      { label: 'Base Location', value: 'Suryapet & Hyderabad', detail: 'Open to Relocation & Remote' },
    ],
    avatarPhotoUrl: '/profile.jpg',
    // Compatibility fields
    degree: 'B.Tech in Computer Science and Engineering',
    specialization: 'Artificial Intelligence and Machine Learning (AI & ML)',
    university: 'Malla Reddy University',
    tagline:
      'Building practical AI/ML prototypes, responsive web interfaces, and reliable technical workflows with a disciplined engineering mindset.',
    email: 'challachandu67@gmail.com',
    phone: '+91 9059169996',
    resumeUrl: '/Chandu_Challa_Resume.pdf',
    avatarUrl: '/profile.jpg',
    initials: 'CC',
    availabilityBadge: 'Open to Entry-Level AI/ML, Junior Web Dev & Technical Support Roles',
    heroTitleLine1: 'I BUILD',
    heroTitleLine2: 'DIGITAL',
    heroTitleLine3: 'EXPERIENCES',
    heroNarrative:
      'I build intelligent digital experiences and production-ready machine learning systems. Where modern full-stack software engineering meets computer vision, NLP, and applied AI.',
    heroBadges: [
      'FULL STACK ARCHITECTURE',
      'AI & COMPUTER VISION',
      'DATA SCIENCE & ML',
    ],
    careerObjective:
      'Contribute to engineering teams in entry-level AI/ML, junior web development, or technical support engineering roles where analytical problem-solving and clean implementation create immediate value.',
    socialLinks: [
      {
        id: 'github',
        label: 'GitHub',
        url: 'https://github.com/',
        username: '@chandu-challa',
        isPlaceholder: false,
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/',
        username: 'in/chandu-challa',
        isPlaceholder: false,
      },
      {
        id: 'email',
        label: 'Email',
        url: 'mailto:challachandu67@gmail.com',
        username: 'challachandu67@gmail.com',
        isPlaceholder: false,
      },
    ],
  },
  education: [
    {
      id: 'edu-mru',
      institution: 'Malla Reddy University',
      degree: 'Bachelor of Technology (B.Tech)',
      specialization: 'Computer Science and Engineering — Artificial Intelligence and Machine Learning',
      startDate: '2021',
      completionDate: '2025',
      status: 'Graduated',
      grade: '7.65',
      period: '2021 — 2025 (Graduated)',
      location: 'Hyderabad, Telangana, India',
      statusBadge: 'CSE — AI & ML Graduate',
      description:
        'Undergraduate specialization in Artificial Intelligence & Machine Learning, covering deep learning, computer vision, natural language processing, object-oriented programming in Python, and full-stack web fundamentals.',
      coursework: [
        'Artificial Intelligence',
        'Machine Learning',
        'Computer Vision (YOLO & OpenCV)',
        'Natural Language Processing',
        'Python Programming & OOP',
        'Web Technologies (HTML5 & CSS3)',
        'Data Structures & Algorithms',
        'Database Management Systems',
      ],
      keyCoursework: [
        'Artificial Intelligence',
        'Machine Learning',
        'Computer Vision (YOLO & OpenCV)',
        'Natural Language Processing',
        'Python Programming & OOP',
        'Web Technologies (HTML5 & CSS3)',
      ],
    },
  ],
  skills: [
    {
      id: 'sk-1',
      name: 'Python',
      category: 'Programming Languages',
      note: 'AI/ML pipelines, data preprocessing, scripting, and automation',
    },
    {
      id: 'sk-3',
      name: 'HTML5 & CSS3',
      category: 'Web Technologies',
      note: 'Semantic markup, responsive layouts, Flexbox, CSS Grid, and modern UI styling',
    },
    {
      id: 'sk-4',
      name: 'Streamlit UI',
      category: 'Web Technologies',
      note: 'Interactive web interfaces for Python machine learning and LLM prototypes',
    },
    {
      id: 'sk-5',
      name: 'YOLO & OpenCV',
      category: 'AI/ML & Data',
      note: 'Real-time bounding-box object/theft detection and video frame stream processing',
    },
    {
      id: 'sk-6',
      name: 'NLP & scikit-learn',
      category: 'AI/ML & Data',
      note: 'TF-IDF vectorization, text preprocessing, and toxic span classification',
    },
    {
      id: 'sk-8',
      name: 'LangChain & Conversational AI',
      category: 'AI/ML & Data',
      note: 'Prompt template orchestration, conversational memory chains, and chatbot workflows',
    },
    {
      id: 'sk-9',
      name: 'Librosa Audio Analysis',
      category: 'AI/ML & Data',
      note: 'MFCC acoustic feature extraction and multi-class music genre classification',
    },
    {
      id: 'sk-10',
      name: 'System Diagnostics & CLI',
      category: 'Tools & Platforms',
      note: 'Windows PowerShell, Git, environment configuration, and dependency troubleshooting',
    },
    {
      id: 'sk-11',
      name: 'MS Excel, Word & PowerPoint',
      category: 'Professional & Communication Skills',
      note: 'Structured data tracking, technical documentation, and event coordination',
    },
    {
      id: 'sk-12',
      name: 'Technical Event Coordination',
      category: 'Professional & Communication Skills',
      note: 'National-level university technical event scheduling and on-ground logistics',
    },
  ],
  projects: [
    {
      id: 'proj-yolo',
      title: 'YOLO-Based Object & Theft Detection System',
      shortDescription:
        'Real-time computer vision pipeline in Python using YOLO and OpenCV to detect, classify, and track objects and perimeter intrusions across video streams.',
      problemSolved:
        'Manual monitoring of camera feeds is slow and prone to human fatigue. This system automates single-stage bounding-box detection and confidence scoring in real time.',
      problemStatement:
        'Manual monitoring of camera feeds is slow and prone to human fatigue. This system automates single-stage bounding-box detection and confidence scoring in real time.',
      myContribution:
        'Set up Python computer vision environment, integrated pre-trained YOLO model with OpenCV frame buffer, and rendered real-time bounding boxes with class detection alerts.',
      features: [
        'Real-time bounding-box detection with live class confidence overlays',
        'Automated theft/intrusion region-of-interest (ROI) alert triggers',
        'Multi-object frame tracking using OpenCV video stream capture',
      ],
      keyFeatures: [
        'Real-time bounding-box detection with live class confidence overlays',
        'Automated theft/intrusion region-of-interest (ROI) alert triggers',
        'Multi-object frame tracking using OpenCV video stream capture',
      ],
      workflowSteps: [
        'Frame Ingestion: OpenCV reads video file or webcam stream.',
        'Inference: Frames passed to YOLO detection network.',
        'NMS Filtering: Overlapping boxes removed via Non-Maximum Suppression.',
        'HUD Overlay: Color-coded bounding boxes and intrusion alerts drawn.',
      ],
      challengesAndLessons: [
        'Resolved OpenCV and PyTorch version mismatches in dedicated Python virtual environment.',
        'Calibrated confidence thresholds to eliminate false positives under varying room lighting.',
      ],
      technologies: ['Python', 'YOLO', 'OpenCV', 'NumPy', 'Computer Vision'],
      category: 'Computer Vision',
      visualType: 'yolo',
      previewVisualType: 'vision',
      githubUrl: 'https://github.com/',
      demoUrl: '',
      featured: true,
      status: 'Completed Prototype',
      projectTypeBadge: 'Academic Prototype',
      order: 1,
    },
    {
      id: 'proj-nlp',
      title: 'Toxic Span & Text Classification Pipeline',
      shortDescription:
        'Supervised NLP pipeline that normalizes user text, extracts TF-IDF vectors, and flags toxic or abusive character spans.',
      problemSolved:
        'Online platforms need automated moderation pipelines capable of pinpointing exact harmful language spans accurately and consistently.',
      problemStatement:
        'Online platforms need automated moderation pipelines capable of pinpointing exact harmful language spans accurately and consistently.',
      myContribution:
        'Built text normalization pipeline in Python, generated TF-IDF feature matrices, trained scikit-learn classification models, and highlighted toxic token offsets.',
      features: [
        'Automated text cleaning, stop-word filtering, and tokenization',
        'TF-IDF feature vectorization and supervised span classifier training',
        'Interactive inference testing on custom text inputs with span offset highlighting',
      ],
      keyFeatures: [
        'Automated text cleaning, stop-word filtering, and tokenization',
        'TF-IDF feature vectorization and supervised span classifier training',
        'Interactive inference testing on custom text inputs with span offset highlighting',
      ],
      workflowSteps: [
        'Data Cleaning: Lowercased text, stripped special symbols, removed stop words.',
        'Vectorization: Computed TF-IDF n-gram token weights.',
        'Classifier Training: Fit linear and tree-based classifiers to detect toxic spans.',
        'Span Highlighting: Rendered highlighted token boundaries with confidence scores.',
      ],
      challengesAndLessons: [
        'Addressed class imbalance using stratified train-test splits and weighted loss penalties.',
        'Debugged feature dimension mismatches during dynamic inference evaluation.',
      ],
      technologies: ['Python', 'scikit-learn', 'NLP', 'TF-IDF', 'Pandas'],
      category: 'Natural Language Processing',
      visualType: 'nlp',
      previewVisualType: 'nlp',
      githubUrl: 'https://github.com/',
      demoUrl: '',
      featured: true,
      status: 'Completed Prototype',
      projectTypeBadge: 'Academic Prototype',
      order: 2,
    },
    {
      id: 'proj-audio',
      title: 'Music Genre Classification System',
      shortDescription:
        'Extracts MFCCs and spectral acoustic descriptors from audio waveforms to classify music tracks into distinct genres.',
      problemSolved:
        'Categorizing raw audio files requires digital signal feature extraction rather than relying on incomplete file metadata.',
      problemStatement:
        'Categorizing raw audio files requires digital signal feature extraction rather than relying on incomplete file metadata.',
      myContribution:
        'Designed digital audio feature extraction scripts using Librosa, structured acoustic tabular datasets, and trained multi-class genre predictors.',
      features: [
        'MFCC, spectral centroid, and zero-crossing rate extraction via Librosa',
        'Feature normalization and multi-class supervised classification',
        'Waveform and spectrogram visual diagnostics',
      ],
      keyFeatures: [
        'MFCC, spectral centroid, and zero-crossing rate extraction via Librosa',
        'Feature normalization and multi-class supervised classification',
        'Waveform and spectrogram visual diagnostics',
      ],
      workflowSteps: [
        'Audio Loading: Waveform decoded at 22,050 Hz sampling rate.',
        'Feature Extraction: Extracted 20 MFCCs, spectral roll-off, and centroid.',
        'Feature Scaling: Applied StandardScaler normalization across acoustic vectors.',
        'Classification: Predicted genre probabilities across candidate music genres.',
      ],
      challengesAndLessons: [
        'Resolved audio decoding and system ffmpeg library configuration on Windows.',
        'Analyzed why MFCC coefficients capture timbral texture better than raw amplitude time-series.',
      ],
      technologies: ['Python', 'Librosa', 'scikit-learn', 'NumPy', 'Audio ML'],
      category: 'Audio ML',
      visualType: 'audio',
      previewVisualType: 'audio',
      githubUrl: 'https://github.com/',
      demoUrl: '',
      featured: true,
      status: 'Completed Prototype',
      projectTypeBadge: 'Academic Prototype',
      order: 3,
    },
    {
      id: 'proj-chatbot',
      title: 'Conversational AI Chatbot (LangChain & Streamlit)',
      shortDescription:
        'Interactive browser-based AI assistant combining LangChain prompt orchestration with persistent Streamlit session state.',
      problemSolved:
        'Standalone LLM scripts lack conversational context memory and accessible user interfaces for multi-turn dialogue.',
      problemStatement:
        'Standalone LLM scripts lack conversational context memory and accessible user interfaces for multi-turn dialogue.',
      myContribution:
        'Designed interactive Streamlit interface, formatted LangChain prompt templates, implemented session-state message memory, and secured API key handling.',
      features: [
        'Streamlit conversational UI with persistent multi-turn chat history',
        'Structured LangChain prompt templates and context window management',
        'Environment-variable API key configuration and graceful error handling',
      ],
      keyFeatures: [
        'Streamlit conversational UI with persistent multi-turn chat history',
        'Structured LangChain prompt templates and context window management',
        'Environment-variable API key configuration and graceful error handling',
      ],
      workflowSteps: [
        'UI Render: Display chat conversation timeline and text prompt box.',
        'Prompt Formatting: Wrap user input with system role instruction template.',
        'LLM Inference: Query model endpoint and stream response tokens.',
        'State Persistence: Commit new turn to Streamlit session_state memory.',
      ],
      challengesAndLessons: [
        'Learned how Streamlit script execution model works and why session state is vital.',
        'Enforced strict security to prevent exposing API keys in public repositories.',
      ],
      technologies: ['Python', 'LangChain', 'Streamlit', 'Prompt Engineering'],
      category: 'Generative AI',
      visualType: 'chatbot',
      previewVisualType: 'chatbot',
      githubUrl: 'https://github.com/',
      demoUrl: '',
      featured: false,
      status: 'Completed Prototype',
      projectTypeBadge: 'Academic Prototype',
      order: 4,
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'National-Level Technical Event Coordination',
      organization: 'Malla Reddy University',
      category: 'Leadership & Logistics',
      statusNote: 'Event Coordinator',
      description:
        'Coordinated participant schedules, session logistics, registration tracking in Excel, and on-ground technical support for national-level university events.',
      keyTakeaways: [
        'Managed schedule coordination across multi-track university sessions.',
        'Handled participant databases, certificates, and presentation hardware setup.',
        'Delivered reliable on-ground problem resolution under time pressure.',
      ],
    },
    {
      id: 'ach-2',
      title: 'Multi-Domain AI/ML Prototype Development',
      organization: 'Academic & Practical Engineering Labs',
      category: 'Technical Delivery',
      statusNote: '4 AI/ML Systems',
      description:
        'Built and validated four end-to-end machine learning prototypes spanning Computer Vision, Toxic Span NLP, Audio Signal Processing, and Conversational AI.',
      keyTakeaways: [
        'Engineered working pipelines from raw data preprocessing to evaluation.',
        'Acquired practical experience with YOLO, OpenCV, Librosa, and LangChain.',
      ],
    },
  ],
  troubleshootingList: [
    {
      id: 'tb-1',
      title: 'Windows PowerShell ExecutionPolicy & PATH Diagnostics',
      domain: 'Environment & CLI',
      scenario:
        'Developer CLI tools (Node.js, npm, Python virtual env scripts) fail to run due to PSSecurityException or missing system PATH variables.',
      diagnosticApproach:
        'Check binary installation paths using where.exe, inspect active PowerShell execution policy scopes via Get-ExecutionPolicy -List.',
      resolutionAndTakeaway:
        'Configure user-scoped RemoteSigned policy (Set-ExecutionPolicy -Scope CurrentUser) and verify user PATH without lowering system-wide security.',
      toolsUsed: ['Windows PowerShell', 'Node.js', 'Git CLI', 'VS Code'],
    },
    {
      id: 'tb-2',
      title: 'Python Virtual Environments & ML Library Conflicts',
      domain: 'Python & ML Dependencies',
      scenario:
        'OpenCV, Librosa, scikit-learn, and PyTorch encounter C-extension compilation errors or conflicting NumPy version dependencies.',
      diagnosticApproach:
        'Isolate dependencies inside dedicated Python virtual environments (python -m venv venv), inspect installed packages with pip list.',
      resolutionAndTakeaway:
        'Pin compatible version constraints in requirements.txt and use separate virtual environments per project to prevent namespace collisions.',
      toolsUsed: ['Python venv', 'pip', 'OpenCV', 'scikit-learn'],
    },
    {
      id: 'tb-3',
      title: 'Responsive Web Layout & Horizontal Scrollbar Debugging',
      domain: 'Frontend & UI Layouts',
      scenario:
        'Unwanted horizontal overflow and misaligned elements on mobile screens caused by fixed pixel widths or unconstrained flex containers.',
      diagnosticApproach:
        'Inspect elements using browser DevTools Device Toolbar, trace overflowing bounding boxes with outlines.',
      resolutionAndTakeaway:
        'Implement fluid percentage/vw widths, Flexbox/Grid wrapping, and apply overflow-x: hidden safeguards on root containers.',
      toolsUsed: ['HTML5', 'CSS3 / Tailwind', 'DevTools', 'Responsive Design'],
    },
    {
      id: 'tb-4',
      title: 'Structured Data Cleaning & Reporting in Excel',
      domain: 'Data Organization & Office',
      scenario:
        'Raw registration rosters and model benchmark tables contain duplicate entries, irregular casing, and unformatted metric rows.',
      diagnosticApproach:
        'Apply duplicate removal rules, TRIM/UPPER formulas, and build structured summary tables in Microsoft Excel.',
      resolutionAndTakeaway:
        'Generate executive-ready summary charts and standardized tables that enable coordinators to make immediate decisions.',
      toolsUsed: ['Microsoft Excel', 'Data Formatting', 'Summary Reports'],
    },
  ],
  resume: {
    fileName: 'Chandu_Challa_Resume.pdf',
    dataUrl: '',
    updatedAt: 'October 2025',
    published: true,
  },
  contact: {
    email: 'challachandu67@gmail.com',
    phone: '+91 9059169996',
    location: 'Suryapet & Hyderabad, Telangana, India',
    githubUrl: 'https://github.com/67chandu',
    linkedinUrl: 'https://www.linkedin.com/',
    naukriUrl: 'https://www.naukri.com/mnjuser/profile',
    webhookUrl: '',
  },
  footer: {
    tagline:
      'Computer Science & Engineering (Artificial Intelligence and Machine Learning) • Malla Reddy University',
    copyrightName: 'Chandu Challa',
    naukriUrl: 'https://www.naukri.com/mnjuser/profile',
  },
  appearance: {
    enable3DAvatar: true,
    enableParticles: true,
    enable3DTilt: true,
    showAboutSection: true,
    showSkillsSection: true,
    showProjectsSection: true,
    showEducationSection: true,
    showContactSection: true,
    showTroubleshootingSection: true,
  },
  adminPin: import.meta.env.VITE_ADMIN_PIN || '2025',
}

// Aliases for compatibility
initialPortfolioData.educationList = initialPortfolioData.education
initialPortfolioData.featuredProjects = initialPortfolioData.projects
initialPortfolioData.achievementsList = initialPortfolioData.achievements

export const defaultPortfolioData = initialPortfolioData
export const defaultportfolioData = initialPortfolioData
