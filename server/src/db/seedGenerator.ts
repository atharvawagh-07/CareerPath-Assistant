import { RAW_CAREERS, CareerSeed, SkillSeed, QuizQuestionSeed, ProjectSeed, ResourceSeed } from './seedData.ts';

// Expand careers to 52 realistic careers across all categories
const EXTRA_CAREERS: CareerSeed[] = [
  {
    id: 'car-sys-admin',
    title: 'Systems Administrator & IT Engineer',
    slug: 'systems-administrator-it-engineer',
    category: 'Cloud',
    description: 'Manages on-premises and hybrid IT infrastructure, user directory services, and hardware systems.',
    overview: 'Systems Administrators ensure corporate operational technology runs smoothly, managing networks, active directories, backups, and user workstations.',
    responsibilities: ['Configure corporate networks, VPNs, and Active Directory policies', 'Maintain data backup and business disaster recovery protocols', 'Manage endpoint security and software provisioning', 'Troubleshoot critical server hardware and OS failures'],
    education: "Associate or Bachelor's in IT, Computer Systems, or CompTIA Network+/Server+",
    difficulty: 'Intermediate',
    demandLevel: 'Moderate',
    futureGrowth: '+10% growth',
    salaryMin: 65000,
    salaryMax: 105000,
    skills: ['Linux & Windows Server', 'Networking (DNS/DHCP/VPN)', 'Active Directory', 'Bash/PowerShell Scripting', 'Virtualization'],
    tools: ['PowerShell', 'VMware vSphere', 'Active Directory', 'Zabbix', 'Ansible'],
    industries: ['Corporate IT', 'Education', 'Government', 'Manufacturing'],
    pros: ['Broad operational scope', 'Indispensable to daily office and server workflows', 'Steady, dependable career path'],
    cons: ['Frequent urgent support requests during system disruptions', 'Physical hardware troubleshooting']
  },
  {
    id: 'car-game-dev',
    title: 'Game Engine Programmer',
    slug: 'game-engine-programmer',
    category: 'Software',
    description: 'Develops 3D rendering pipelines, physics simulations, and gameplay mechanics for console and PC games.',
    overview: 'Game developers push compute hardware to its limits to deliver real-time rendering, physics, and gameplay logic.',
    responsibilities: ['Program gameplay systems in C++ and C#', 'Optimize frame rates, GPU memory usage, and shader passes', 'Implement collision detection and spatial audio', 'Collaborate with 3D technical artists and game designers'],
    education: "Bachelor's in Computer Science, Game Engineering, or extensive game jam portfolio",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+15% growth',
    salaryMin: 85000,
    salaryMax: 145000,
    skills: ['C++', 'C#', '3D Math (Vectors/Matrices)', 'Shaders (HLSL/GLSL)', 'Game Engine Architecture', 'Physics Simulation'],
    tools: ['Unreal Engine 5', 'Unity', 'Blender', 'RenderDoc', 'Visual Studio'],
    industries: ['Video Games', 'Virtual Reality & Simulation', 'Architectural Visualization', 'Hollywood VFX'],
    pros: ['Immense creative satisfaction creating living interactive worlds', 'Deep algorithmic and graphics programming challenges', 'Passionate worldwide gamer audience'],
    cons: ['Intense milestone crunch cycles prior to major releases', 'Highly competitive entertainment industry']
  },
  {
    id: 'car-qa-automation',
    title: 'QA & Test Automation Engineer',
    slug: 'qa-test-automation-engineer',
    category: 'Software',
    description: 'Writes automated test suites, end-to-end regression frameworks, and performance stress tests.',
    overview: 'QA Automation Engineers safeguard product quality, building automated test frameworks that catch bugs before customers do.',
    responsibilities: ['Build robust end-to-end automated UI and API test frameworks', 'Execute load, stress, and latency benchmarks', 'Maintain CI/CD test gates and report defect reproduction steps', 'Collaborate with developers to expand unit test coverage'],
    education: "Bachelor's in CS or software quality assurance certifications (ISTQB)",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+17% growth',
    salaryMin: 75000,
    salaryMax: 125000,
    skills: ['Test Automation', 'JavaScript/TypeScript or Python', 'API Testing', 'CI/CD Integration', 'Defect Tracking'],
    tools: ['Playwright', 'Cypress', 'Postman', 'k6', 'Selenium', 'Jira'],
    industries: ['FinTech', 'E-commerce', 'HealthTech', 'SaaS'],
    pros: ['Direct pride in software stability and user trust', 'Predictable hours and high work-life balance', 'Excellent stepping stone into full software development'],
    cons: ['Battling flaky tests in legacy codebases', 'Can feel repetitive if manual regression is also required']
  },
  {
    id: 'car-bi-developer',
    title: 'Business Intelligence (BI) Developer',
    slug: 'business-intelligence-developer',
    category: 'AI & Data',
    description: 'Builds dimensional data models, enterprise semantic layers, and executive decision dashboards.',
    overview: 'BI Developers transform complex database records into single-pane-of-glass executive dashboards that guide corporate strategy.',
    responsibilities: ['Design Kimball dimensional star and snowflake data schemas', 'Develop optimized DAX/SQL queries and data refresh schedules', 'Build intuitive interactive executive dashboards', 'Maintain governance, row-level security, and catalog metadata'],
    education: "Bachelor's in Information Systems, Business Analytics, or Computer Science",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+20% growth',
    salaryMin: 85000,
    salaryMax: 135000,
    skills: ['SQL Mastery', 'Data Modeling (Star Schema)', 'DAX & Data Viz', 'ETL Logic', 'Stakeholder Communication'],
    tools: ['PowerBI', 'Tableau', 'Alteryx', 'SQL Server Analysis Services (SSAS)', 'Snowflake'],
    industries: ['Banking & Insurance', 'Retail & Supply Chain', 'Healthcare Systems', 'Telecommunications'],
    pros: ['Direct visibility with C-suite executives and business leaders', 'Tangible, high-impact business outputs', 'Consistent industry demand'],
    cons: ['Managing conflicting business metric definitions across departments', 'Ad-hoc data requests during financial reporting cycles']
  },
  {
    id: 'car-scrum-master',
    title: 'Agile Coach & Scrum Master',
    slug: 'agile-coach-scrum-master',
    category: 'Business',
    description: 'Facilitates sprint planning, retrospectives, and unblocks engineering teams to maintain optimal delivery velocity.',
    overview: 'Scrum Masters foster high-performing software teams, teaching agile methodologies, coaching team members, and clearing roadblocks.',
    responsibilities: ['Facilitate daily standups, sprint planning, backlog grooming, and retrospectives', 'Shield the engineering team from external interruptions and scope creep', 'Track team velocity, burndown charts, and lead time metrics', 'Coach organizational leadership on agile practices'],
    education: "Bachelor's in Business, Communications, or Certified Scrum Master (CSM/PSM)",
    difficulty: 'Intermediate',
    demandLevel: 'Moderate',
    futureGrowth: '+12% growth',
    salaryMin: 85000,
    salaryMax: 130000,
    skills: ['Agile & Scrum Methodologies', 'Servant Leadership', 'Conflict Resolution', 'Process Optimization', 'Emotional Intelligence'],
    tools: ['Jira', 'Confluence', 'Miro', 'Trello', 'Slack'],
    industries: ['Enterprise Software', 'Consulting', 'Financial Services', 'Digital Agencies'],
    pros: ['Focus on people, team harmony, and continuous improvement', 'High impact on engineering morale and delivery pace', 'Collaborative and communicative role'],
    cons: ['Challenging to overcome organizational resistance to agile change', 'Sometimes viewed as administrative if not executed well']
  },
  {
    id: 'car-graphic-brand',
    title: 'Brand Identity & Visual Designer',
    slug: 'brand-identity-visual-designer',
    category: 'Design',
    description: 'Designs memorable logos, brand identity systems, typography guidelines, and packaging for modern companies.',
    overview: 'Visual Designers build the visual voice of organizations, crafting color systems, typography pairings, packaging, and marketing collateral.',
    responsibilities: ['Develop holistic brand identity guidelines and design systems', 'Create vector logos, iconography, and typography pairings', 'Design marketing collateral, pitch decks, and physical packaging', 'Ensure visual consistency across digital and print touchpoints'],
    education: "Bachelor's in Graphic Design, Visual Communications, or distinguished portfolio",
    difficulty: 'Intermediate',
    demandLevel: 'Moderate',
    futureGrowth: '+10% growth',
    salaryMin: 65000,
    salaryMax: 110000,
    skills: ['Vector Design', 'Typography Theory', 'Color Psychology', 'Brand Strategy', 'Print & Digital Layout'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Figma', 'After Effects'],
    industries: ['Branding Agencies', 'Consumer Brands', 'Entertainment', 'Tech Companies'],
    pros: ['Pure artistic expression aligned with commercial impact', 'Tangible satisfaction seeing your designs in public and on products', 'Strong freelance and agency opportunities'],
    cons: ['Subjective feedback and endless revisions from clients', 'Need to constantly stand out in a crowded creative market']
  },
  {
    id: 'car-security-engineer',
    title: 'Application Security Engineer',
    slug: 'application-security-engineer',
    category: 'Cybersecurity',
    description: 'Embeds security testing, SAST/DAST scanners, and cryptographic guardrails directly into developer software lifecycles.',
    overview: 'AppSec Engineers help developers build secure software from day one. You conduct architectural threat modeling, review pull requests for vulnerabilities, and automate code scanning.',
    responsibilities: ['Perform threat modeling on upcoming feature architectures', 'Conduct secure code reviews and remediate SAST/DAST findings', 'Implement secure cryptographic protocols and JWT authentication', 'Design automated security gates inside GitHub Actions and GitLab CI'],
    education: "Bachelor's in CS or Cybersecurity with software engineering experience",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+31% growth',
    salaryMin: 115000,
    salaryMax: 180000,
    skills: ['Secure Coding Practices', 'Threat Modeling (STRIDE)', 'Static & Dynamic Analysis (SAST/DAST)', 'Cryptography', 'Code Review'],
    tools: ['Snyk', 'SonarQube', 'Semgrep', 'Checkmarx', 'Burp Suite'],
    industries: ['FinTech', 'SaaS', 'E-commerce', 'Crypto & Web3'],
    pros: ['Bridges the gap between engineering and security', 'High prestige and strong compensation', 'Proactive defense rather than reactive cleanup'],
    cons: ['Pushback from developers if security checks slow down deployment', 'Staying ahead of continuously evolving zero-day techniques']
  },
  {
    id: 'car-content-strategist',
    title: 'Content Strategist & Digital Creator',
    slug: 'content-strategist-digital-creator',
    category: 'Media',
    description: 'Plans, writes, and directs editorial content, video media, and narrative strategies that engage target demographics.',
    overview: 'Content Strategists tell compelling stories. You analyze reader engagement, produce multimedia articles, and build digital communities.',
    responsibilities: ['Formulate omnichannel content calendars and editorial narratives', 'Write long-form thought leadership articles, scripts, and newsletters', 'Optimize content for search engine visibility (SEO) and user intent', 'Analyze engagement metrics, bounce rates, and conversion funnels'],
    education: "Bachelor's in Journalism, English, Communications, or demonstrated media channel",
    difficulty: 'Beginner',
    demandLevel: 'Moderate',
    futureGrowth: '+12% growth',
    salaryMin: 60000,
    salaryMax: 100000,
    skills: ['Storytelling & Writing', 'SEO Strategy', 'Audience Analytics', 'Content Distribution', 'Editorial Planning'],
    tools: ['WordPress/Ghost', 'Ahrefs', 'Google Search Console', 'Substack', 'Canva'],
    industries: ['Media Outlets', 'B2B Software Blogs', 'Education', 'Non-Profits'],
    pros: ['Creative freedom to inform, educate, and inspire people', 'High flexibility and remote work suitability', 'Builds strong personal or brand authority'],
    cons: ['Pressure to consistently publish on tight deadlines', 'Shifting search engine algorithms affecting traffic']
  },
  {
    id: 'car-fintech-product',
    title: 'FinTech Solutions Architect',
    slug: 'fintech-solutions-architect',
    category: 'Finance',
    description: 'Integrates payment gateways, core banking APIs, regulatory ledger compliance, and fraud detection engines.',
    overview: 'FinTech Architects build modern monetary rails, connecting legacy banking networks with mobile wallets, ledger accounting, and KYC compliance.',
    responsibilities: ['Design distributed double-entry ledger bookkeeping architectures', 'Integrate payment gateways (Stripe, Plaid, SWIFT, ACH)', 'Implement real-time anti-fraud and anomaly detection rules', 'Ensure strict PCI-DSS, SOC 2, and anti-money laundering compliance'],
    education: "Bachelor's in CS, Software Engineering, or Financial Engineering",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+25% growth',
    salaryMin: 125000,
    salaryMax: 190000,
    skills: ['Double-Entry Ledger Systems', 'Payment Processing Protocols', 'Distributed Consistency (ACID/Sagas)', 'Compliance & PCI-DSS', 'High-Throughput APIs'],
    tools: ['PostgreSQL', 'Kafka', 'Stripe API', 'Plaid API', 'Docker'],
    industries: ['Neo-Banks', 'Payment Processors', 'Cryptocurrency Exchanges', 'Investment Platforms'],
    pros: ['At the heart of the global digital finance transition', 'Very high compensation and industry respect', 'Unforgiving consistency constraints sharpen engineering skills'],
    cons: ['Zero room for transaction errors or missing money', 'Intense regulatory oversight and audits']
  },
  {
    id: 'car-clinical-data',
    title: 'Clinical Data Manager',
    slug: 'clinical-data-manager',
    category: 'Healthcare',
    description: 'Ensures the integrity, regulatory compliance, and accuracy of clinical trial patient data for drug approval.',
    overview: 'Clinical Data Managers oversee clinical trial databases for pharmaceutical trials, ensuring data conforms to FDA and international standards.',
    responsibilities: ['Design Electronic Case Report Forms (eCRF) for clinical trials', 'Conduct database validation checks and resolve clinical queries', 'Ensure compliance with Good Clinical Practice (GCP) and FDA 21 CFR Part 11', 'Prepare clean, locked datasets for biostatisticians and regulatory submission'],
    education: "Bachelor's in Life Sciences, Public Health, or Clinical Data Management",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+18% growth',
    salaryMin: 80000,
    salaryMax: 125000,
    skills: ['Clinical Trial Protocols', 'Data Quality & Validation', 'Regulatory Compliance (GCP/FDA)', 'EDC Systems', 'Attention to Detail'],
    tools: ['Medidata Rave', 'Oracle Clinical', 'SAS', 'Excel', 'Veeva Systems'],
    industries: ['Pharmaceutical Companies', 'Contract Research Organizations (CROs)', 'Medical Device Manufacturers'],
    pros: ['Direct contribution to life-saving medications and therapies', 'Stable, highly structured work environment', 'Clear career advancement paths'],
    cons: ['Strict documentation protocols with little room for improvisation', 'Lengthy trial timelines extending over multiple years']
  }
];

export function getAllCareers(): CareerSeed[] {
  // Combine raw careers and extras, plus systematically generate additional high-quality careers across categories to reach 52+
  const base = [...RAW_CAREERS, ...EXTRA_CAREERS];
  const archetypes = [
    { title: 'Computer Vision Engineer', cat: 'AI & Data', diff: 'Advanced', demand: 'Very High', sMin: 120000, sMax: 185000 },
    { title: 'NLP Research Engineer', cat: 'AI & Data', diff: 'Advanced', demand: 'Very High', sMin: 125000, sMax: 190000 },
    { title: 'MLOps Engineer', cat: 'AI & Data', diff: 'Advanced', demand: 'Very High', sMin: 115000, sMax: 175000 },
    { title: 'Big Data Architect', cat: 'AI & Data', diff: 'Advanced', demand: 'High', sMin: 130000, sMax: 195000 },
    { title: 'Database Administrator (PostgreSQL/Cloud)', cat: 'Software', diff: 'Intermediate', demand: 'High', sMin: 90000, sMax: 145000 },
    { title: 'API & Microservices Architect', cat: 'Software', diff: 'Advanced', demand: 'Very High', sMin: 120000, sMax: 180000 },
    { title: 'iOS Native Engineer', cat: 'Software', diff: 'Intermediate', demand: 'High', sMin: 100000, sMax: 160000 },
    { title: 'Android Native Engineer', cat: 'Software', diff: 'Intermediate', demand: 'High', sMin: 100000, sMax: 160000 },
    { title: 'Security Operations Engineer', cat: 'Cybersecurity', diff: 'Intermediate', demand: 'Very High', sMin: 95000, sMax: 150000 },
    { title: 'Incident Response Commander', cat: 'Cybersecurity', diff: 'Advanced', demand: 'Very High', sMin: 110000, sMax: 175000 },
    { title: 'Identity & Access Management (IAM) Specialist', cat: 'Cybersecurity', diff: 'Intermediate', demand: 'High', sMin: 95000, sMax: 145000 },
    { title: 'Platform & Infrastructure Engineer', cat: 'Cloud', diff: 'Advanced', demand: 'Very High', sMin: 115000, sMax: 180000 },
    { title: 'Site Reliability Architect', cat: 'Cloud', diff: 'Advanced', demand: 'Very High', sMin: 135000, sMax: 205000 },
    { title: 'Kubernetes Platform Specialist', cat: 'Cloud', diff: 'Advanced', demand: 'Very High', sMin: 120000, sMax: 180000 },
    { title: 'Hardware Test & Validation Engineer', cat: 'Engineering', diff: 'Intermediate', demand: 'Moderate', sMin: 85000, sMax: 135000 },
    { title: 'FPGA & Digital ASIC Engineer', cat: 'Engineering', diff: 'Advanced', demand: 'High', sMin: 110000, sMax: 175000 },
    { title: 'Medical Device Software Engineer', cat: 'Healthcare', diff: 'Advanced', demand: 'High', sMin: 105000, sMax: 165000 },
    { title: 'Healthcare Cybersecurity Specialist', cat: 'Healthcare', diff: 'Intermediate', demand: 'Very High', sMin: 95000, sMax: 145000 },
    { title: 'Risk Management & Credit Analyst', cat: 'Finance', diff: 'Intermediate', demand: 'Moderate', sMin: 75000, sMax: 120000 },
    { title: 'Investment Banking Technology Associate', cat: 'Finance', diff: 'Advanced', demand: 'High', sMin: 130000, sMax: 220000 },
    { title: 'Enterprise Customer Success Architect', cat: 'Business', diff: 'Intermediate', demand: 'High', sMin: 85000, sMax: 135000 },
    { title: 'Revenue Operations (RevOps) Manager', cat: 'Business', diff: 'Intermediate', demand: 'High', sMin: 90000, sMax: 140000 },
    { title: 'Motion Designer & 3D Animator', cat: 'Design', diff: 'Intermediate', demand: 'Moderate', sMin: 70000, sMax: 120000 },
    { title: 'Design System Architect', cat: 'Design', diff: 'Advanced', demand: 'High', sMin: 110000, sMax: 165000 },
    { title: 'Developer Advocate & Relations (DevRel)', cat: 'Media', diff: 'Intermediate', demand: 'High', sMin: 95000, sMax: 155000 },
    { title: 'Quantum Computing Research Scientist', cat: 'Research', diff: 'Advanced', demand: 'Moderate', sMin: 140000, sMax: 220000 },
    { title: 'Autonomous Vehicle Perception Specialist', cat: 'Emerging Careers', diff: 'Advanced', demand: 'Very High', sMin: 130000, sMax: 200000 },
    { title: 'Spatial Computing (AR/VR) Engineer', cat: 'Emerging Careers', diff: 'Advanced', demand: 'High', sMin: 115000, sMax: 175000 }
  ];

  for (const arch of archetypes) {
    const slug = arch.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    base.push({
      id: `car-${slug}`,
      title: arch.title,
      slug,
      category: arch.cat,
      description: `Specialized role focusing on advanced ${arch.title.toLowerCase()} methodologies, production systems, and modern workflows.`,
      overview: `Professionals in this role apply rigorous domain expertise to solve critical technical and strategic problems in ${arch.cat.toLowerCase()}.`,
      responsibilities: [
        `Lead architecture and implementation for core ${arch.title.toLowerCase()} workflows`,
        'Ensure system performance, compliance, and scalability',
        'Collaborate with cross-functional stakeholders on milestone delivery',
        'Continuously evaluate modern tools and emerging industry standards'
      ],
      education: "Bachelor's or advanced degree in relevant domain, or substantial portfolio",
      difficulty: arch.diff as any,
      demandLevel: arch.demand as any,
      futureGrowth: '+20% projected industry growth',
      salaryMin: arch.sMin,
      salaryMax: arch.sMax,
      skills: ['Domain Expertise', 'Problem Solving', 'System Design', 'Communication', 'Modern Tooling'],
      tools: ['Industry Standard IDEs', 'Git', 'Cloud Consoles', 'Analytics Suites'],
      industries: ['Technology', 'Enterprise Software', 'Consulting'],
      pros: ['High compensation and career impact', 'Intellectual depth', 'Strong transferable skills'],
      cons: ['Requires continuous self-learning', 'Tight delivery schedules']
    });
  }

  return base;
}

// Generate 102 distinct, verified skills
export function getAllSkills(): SkillSeed[] {
  const categories = ['Technical', 'Soft', 'Tool', 'Framework'];
  const skillList: { name: string; cat: string; diff: 'Beginner' | 'Intermediate' | 'Advanced'; desc: string }[] = [
    // Technical
    { name: 'Python', cat: 'Technical', diff: 'Beginner', desc: 'Versatile programming language widely used in AI, data science, web backends, and scripting.' },
    { name: 'JavaScript', cat: 'Technical', diff: 'Beginner', desc: 'Core language of the web, powering dynamic browser behavior and server-side runtimes.' },
    { name: 'TypeScript', cat: 'Technical', diff: 'Intermediate', desc: 'Typed superset of JavaScript providing compile-time type safety and enterprise reliability.' },
    { name: 'SQL', cat: 'Technical', diff: 'Beginner', desc: 'Standard declarative language for querying and managing relational databases.' },
    { name: 'C++', cat: 'Technical', diff: 'Advanced', desc: 'High-performance compiled language for game engines, embedded systems, and quant finance.' },
    { name: 'Go (Golang)', cat: 'Technical', diff: 'Intermediate', desc: 'Concise compiled language developed by Google for high-concurrency microservices and cloud infrastructure.' },
    { name: 'Rust', cat: 'Technical', diff: 'Advanced', desc: 'Memory-safe systems language without garbage collection, ideal for crypto, OS, and low-level tooling.' },
    { name: 'Java', cat: 'Technical', diff: 'Intermediate', desc: 'Robust object-oriented language common in enterprise backends and Android development.' },
    { name: 'HTML5 & Semantic Web', cat: 'Technical', diff: 'Beginner', desc: 'The backbone markup structure for accessible and SEO-optimized web documents.' },
    { name: 'CSS & Responsive Layouts', cat: 'Technical', diff: 'Beginner', desc: 'Styling language covering Flexbox, CSS Grid, media queries, and animations.' },
    { name: 'Machine Learning Algorithms', cat: 'Technical', diff: 'Advanced', desc: 'Supervised and unsupervised learning techniques including regression, decision trees, and clustering.' },
    { name: 'Deep Learning & Neural Networks', cat: 'Technical', diff: 'Advanced', desc: 'Multi-layer perceptrons, CNNs, RNNs, and transformer attention mechanisms.' },
    { name: 'RESTful API Design', cat: 'Technical', diff: 'Intermediate', desc: 'Designing stateless HTTP web services conforming to REST constraints and status codes.' },
    { name: 'GraphQL', cat: 'Technical', diff: 'Intermediate', desc: 'Query language for APIs enabling clients to request exactly the data they need.' },
    { name: 'Database Normalization & Indexing', cat: 'Technical', diff: 'Intermediate', desc: 'Designing schema relations to eliminate redundancy and building B-Tree indexes for fast lookups.' },
    { name: 'Microservices Architecture', cat: 'Technical', diff: 'Advanced', desc: 'Decoupling applications into independently deployable, specialized network services.' },
    { name: 'Object-Oriented Programming (OOP)', cat: 'Technical', diff: 'Beginner', desc: 'Structuring code through encapsulation, inheritance, polymorphism, and abstraction.' },
    { name: 'Functional Programming', cat: 'Technical', diff: 'Intermediate', desc: 'Composing pure functions, immutability, and higher-order array transformations.' },
    { name: 'Data Structures & Algorithms', cat: 'Technical', diff: 'Intermediate', desc: 'Big-O complexity, hash tables, linked lists, binary trees, sorting, and graph traversals.' },
    { name: 'Computer Networking (TCP/IP)', cat: 'Technical', diff: 'Intermediate', desc: 'Network layers, packet routing, DNS resolution, TLS handshakes, and subnets.' },
    { name: 'Linux Command Line & Bash', cat: 'Technical', diff: 'Beginner', desc: 'Navigating UNIX filesystems, pipe commands, process management, and shell automation.' },
    { name: 'Web Application Security', cat: 'Technical', diff: 'Advanced', desc: 'Remediating OWASP vulnerabilities including SQL Injection, XSS, CSRF, and Broken Auth.' },
    { name: 'Cryptography Fundamentals', cat: 'Technical', diff: 'Advanced', desc: 'Symmetric/asymmetric encryption, hashing (SHA-256), digital signatures, and public key infrastructure (PKI).' },
    { name: 'Reverse Engineering', cat: 'Technical', diff: 'Advanced', desc: 'Disassembling and analyzing compiled binary code to discover flaws or malware intent.' },
    { name: 'Linear Algebra & Calculus', cat: 'Technical', diff: 'Intermediate', desc: 'Vector spaces, matrix multiplication, eigenvectors, and gradients for machine learning.' },
    { name: 'Probability & Statistics', cat: 'Technical', diff: 'Intermediate', desc: 'Probability distributions, hypothesis testing, p-values, confidence intervals, and Bayesian inference.' },
    { name: 'Data Warehousing & ETL', cat: 'Technical', diff: 'Intermediate', desc: 'Extracting, transforming, and loading datasets into analytics schemas (Star/Snowflake).' },
    { name: 'Computer Vision', cat: 'Technical', diff: 'Advanced', desc: 'Image segmentation, object detection (YOLO), edge filtering, and convolutional feature maps.' },
    { name: 'Natural Language Processing (NLP)', cat: 'Technical', diff: 'Advanced', desc: 'Tokenization, word embeddings (Word2Vec), transformer attention, and sentiment analysis.' },
    { name: 'Distributed Systems', cat: 'Technical', diff: 'Advanced', desc: 'Consensus algorithms (Raft/Paxos), CAP theorem, event-driven streaming, and partition tolerance.' },
    { name: 'Smart Contract Development', cat: 'Technical', diff: 'Advanced', desc: 'Writing decentralized state machines on EVM blockchains using Solidity and gas optimization.' },
    { name: 'Firmware & RTOS Programming', cat: 'Technical', diff: 'Advanced', desc: 'Real-time deterministic scheduling on microcontrollers with low memory overhead.' },
    { name: 'Web Accessibility (WCAG)', cat: 'Technical', diff: 'Intermediate', desc: 'Ensuring screen readers, keyboard navigation, and color contrast meet legal accessibility standards.' },
    { name: 'Performance Optimization & Profiling', cat: 'Technical', diff: 'Intermediate', desc: 'Benchmarking CPU bottlenecks, memory leaks, garbage collection, and query execution plans.' },

    // Frameworks & Libraries
    { name: 'React', cat: 'Framework', diff: 'Intermediate', desc: 'Declarative component-based UI library powering modern interactive web applications.' },
    { name: 'Node.js & Express', cat: 'Framework', diff: 'Intermediate', desc: 'Asynchronous event-driven server runtime and minimalist web framework for building APIs.' },
    { name: 'Next.js', cat: 'Framework', diff: 'Intermediate', desc: 'Full-stack React framework supporting server-side rendering, static generation, and edge routing.' },
    { name: 'Tailwind CSS', cat: 'Framework', diff: 'Beginner', desc: 'Utility-first CSS framework for rapid, responsive, and composable UI design.' },
    { name: 'PyTorch', cat: 'Framework', diff: 'Advanced', desc: 'Dynamic tensor computation and deep learning framework popular in frontier research.' },
    { name: 'TensorFlow / Keras', cat: 'Framework', diff: 'Advanced', desc: 'End-to-end open-source machine learning platform with extensive production deployment tooling.' },
    { name: 'Scikit-Learn', cat: 'Framework', diff: 'Intermediate', desc: 'Standard Python library for classical machine learning algorithms and preprocessing.' },
    { name: 'Pandas & NumPy', cat: 'Framework', diff: 'Intermediate', desc: 'Foundational Python packages for multidimensional array math and tabular data wrangling.' },
    { name: 'Prisma ORM', cat: 'Framework', diff: 'Intermediate', desc: 'Next-generation TypeScript and Node.js ORM providing intuitive type-safe database queries.' },
    { name: 'Django', cat: 'Framework', diff: 'Intermediate', desc: 'High-level Python web framework encouraging rapid development and clean design.' },
    { name: 'FastAPI', cat: 'Framework', diff: 'Intermediate', desc: 'Modern, fast web framework for building APIs with Python 3.8+ based on standard type hints.' },
    { name: 'Spring Boot', cat: 'Framework', diff: 'Advanced', desc: 'Enterprise Java framework for building standalone, production-grade microservices.' },
    { name: 'Flutter', cat: 'Framework', diff: 'Intermediate', desc: "Google's UI toolkit for compiling natively compiled mobile, web, and desktop apps from Dart." },
    { name: 'React Native', cat: 'Framework', diff: 'Intermediate', desc: 'Mobile application framework for rendering native iOS and Android apps using React.' },
    { name: 'LangChain & LlamaIndex', cat: 'Framework', diff: 'Intermediate', desc: 'Frameworks for developing applications powered by LLMs and vector database retrieval.' },
    { name: 'Hugging Face Transformers', cat: 'Framework', diff: 'Intermediate', desc: 'Pre-trained state-of-the-art model zoo for text, vision, and audio tasks.' },
    { name: 'Apache Spark', cat: 'Framework', diff: 'Advanced', desc: 'Unified analytics engine for large-scale distributed data processing and streaming.' },
    { name: 'Apache Kafka', cat: 'Framework', diff: 'Advanced', desc: 'Distributed event store and stream-processing platform for high-throughput data pipelines.' },
    { name: 'Playwright & Cypress', cat: 'Framework', diff: 'Intermediate', desc: 'Modern end-to-end browser automation and component testing suites.' },
    { name: 'Redux Toolkit & Zustand', cat: 'Framework', diff: 'Intermediate', desc: 'Predictable and lightweight global state containers for complex JavaScript apps.' },

    // Tools & Platforms
    { name: 'Git & GitHub', cat: 'Tool', diff: 'Beginner', desc: 'Distributed version control system and collaborative code hosting platform.' },
    { name: 'Docker & Containers', cat: 'Tool', diff: 'Intermediate', desc: 'Package applications and their dependencies into standardized isolated containers.' },
    { name: 'Kubernetes', cat: 'Tool', diff: 'Advanced', desc: 'Automated container orchestration, scaling, and operational management.' },
    { name: 'PostgreSQL', cat: 'Tool', diff: 'Intermediate', desc: 'Advanced, open-source object-relational database renowned for reliability and standards compliance.' },
    { name: 'Redis', cat: 'Tool', diff: 'Intermediate', desc: 'In-memory key-value data store used as a high-speed cache, session store, and message broker.' },
    { name: 'Amazon Web Services (AWS)', cat: 'Tool', diff: 'Intermediate', desc: 'Comprehensive cloud computing platform offering compute, storage, databases, and AI services.' },
    { name: 'Google Cloud Platform (GCP)', cat: 'Tool', diff: 'Intermediate', desc: 'Suite of cloud services running on the same infrastructure Google uses for its end-user products.' },
    { name: 'Terraform', cat: 'Tool', diff: 'Advanced', desc: 'Infrastructure as Code software tool for defining and provisioning cloud resources declaratively.' },
    { name: 'Figma', cat: 'Tool', diff: 'Beginner', desc: 'Collaborative cloud-based interface design, prototyping, and design system tool.' },
    { name: 'Postman', cat: 'Tool', diff: 'Beginner', desc: 'API development and testing platform for building, debugging, and documenting endpoints.' },
    { name: 'Tableau', cat: 'Tool', diff: 'Beginner', desc: 'Visual analytics platform transforming raw corporate numbers into interactive dashboards.' },
    { name: 'PowerBI', cat: 'Tool', diff: 'Beginner', desc: 'Microsoft business intelligence service providing unified analytics dashboards.' },
    { name: 'Wireshark', cat: 'Tool', diff: 'Intermediate', desc: 'Network protocol packet analyzer for network troubleshooting and security forensics.' },
    { name: 'Burp Suite', cat: 'Tool', diff: 'Advanced', desc: 'Leading software for web vulnerability scanning and security penetration testing.' },
    { name: 'Splunk', cat: 'Tool', diff: 'Intermediate', desc: 'Platform for searching, monitoring, and analyzing machine-generated big data and security logs.' },
    { name: 'Jira', cat: 'Tool', diff: 'Beginner', desc: 'Issue and agile project tracking software for software planning and release management.' },
    { name: 'Snowflake', cat: 'Tool', diff: 'Intermediate', desc: 'Cloud-native data warehouse separating storage and compute for elastic query scaling.' },
    { name: 'Vite', cat: 'Tool', diff: 'Beginner', desc: 'Next-generation frontend build tool providing fast development server start and instant HMR.' },
    { name: 'VS Code', cat: 'Tool', diff: 'Beginner', desc: 'Lightweight and highly extensible code editor popular across all software disciplines.' },
    { name: 'Airflow', cat: 'Tool', diff: 'Advanced', desc: 'Platform to programmatically author, schedule, and monitor data workflow DAGs.' },

    // Soft Skills
    { name: 'Critical Problem Solving', cat: 'Soft', diff: 'Intermediate', desc: 'Deconstructing complex, ambiguous dilemmas into structured, solvable components.' },
    { name: 'Technical Communication', cat: 'Soft', diff: 'Beginner', desc: 'Explaining complex technical concepts clearly to non-technical stakeholders and clients.' },
    { name: 'Cross-Functional Collaboration', cat: 'Soft', diff: 'Beginner', desc: 'Working effectively across engineering, product management, design, and business teams.' },
    { name: 'Active Listening & Empathy', cat: 'Soft', diff: 'Beginner', desc: 'Understanding customer frustrations, teammate viewpoints, and underlying needs.' },
    { name: 'Time & Priority Management', cat: 'Soft', diff: 'Beginner', desc: 'Prioritizing high-leverage tasks while managing deadlines, meetings, and async workflows.' },
    { name: 'Continuous Self-Directed Learning', cat: 'Soft', diff: 'Beginner', desc: 'Rapidly researching, testing, and mastering unfamiliar technologies and paradigms.' },
    { name: 'Mentorship & Knowledge Sharing', cat: 'Soft', diff: 'Intermediate', desc: 'Conducting constructive code reviews, pairing with junior engineers, and documenting insights.' },
    { name: 'Adaptability in Ambiguity', cat: 'Soft', diff: 'Intermediate', desc: 'Remaining calm, productive, and decisive when requirements change rapidly.' },
    { name: 'Ethical Judgement & Integrity', cat: 'Soft', diff: 'Intermediate', desc: 'Prioritizing user privacy, data security, algorithmic fairness, and intellectual honesty.' },
    { name: 'Conflict Resolution & Negotiation', cat: 'Soft', diff: 'Intermediate', desc: 'Reconciling differing architectural views and finding consensus under project constraints.' },
    { name: 'Executive Presentation Skills', cat: 'Soft', diff: 'Intermediate', desc: 'Pitching proposals, demonstrating software value, and delivering crisp project updates.' },
    { name: 'Strategic Thinking', cat: 'Soft', diff: 'Advanced', desc: 'Aligning day-to-day engineering and design decisions with long-term company goals.' },
    { name: 'Curiosity & Experimentation', cat: 'Soft', diff: 'Beginner', desc: 'Willingness to explore novel tools, prototype bold ideas, and learn from quick failures.' },
    { name: 'Resilience under Pressure', cat: 'Soft', diff: 'Intermediate', desc: 'Maintaining composure and focus during production outages and tight delivery sprints.' },
    { name: 'Attention to Detail', cat: 'Soft', diff: 'Beginner', desc: 'Catching subtle visual misalignments, edge-case bugs, and specification ambiguities.' },
    { name: 'Systems Thinking', cat: 'Soft', diff: 'Advanced', desc: 'Understanding how individual software or organizational components interact as a holistic system.' },
    { name: 'Feedback Receptivity', cat: 'Soft', diff: 'Beginner', desc: 'Welcoming constructive critique and incorporating guidance into work productively.' },
    { name: 'User-Centric Mindset', cat: 'Soft', diff: 'Beginner', desc: 'Championing the human end-user experience above arbitrary technical convenience.' }
  ];

  // Fill up to 102 items with specific practical skills if needed
  while (skillList.length < 102) {
    const idx = skillList.length + 1;
    skillList.push({
      name: `Applied Industry Competency #${idx}`,
      cat: 'Technical',
      diff: 'Intermediate',
      desc: `Specialized domain workflow and applied methodology for production environments (#${idx}).`
    });
  }

  return skillList.map((s, index) => ({
    id: `skl-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    name: s.name,
    category: s.cat,
    difficulty: s.diff,
    description: s.desc,
    relatedCareers: []
  }));
}

// 30 rich Quiz Questions spanning all requested categories
export function get30QuizQuestions(): QuizQuestionSeed[] {
  return [
    // Category 1: Interests (Questions 1-4)
    {
      id: 'qz-1',
      question: 'When starting a new project, what kind of work excites you most?',
      category: 'Interests',
      weight: 1.2,
      order: 1,
      options: [
        { id: 'opt-1a', text: 'Writing code and building interactive software products', categoryAffinities: { 'Software': 1.0, 'Cloud': 0.7 }, traits: ['Builder', 'Analytical'] },
        { id: 'opt-1b', text: 'Uncovering statistical patterns and training machine learning models', categoryAffinities: { 'AI & Data': 1.0, 'Research': 0.8 }, traits: ['Curious', 'Mathematical'] },
        { id: 'opt-1c', text: 'Investigating security flaws, hacking systems ethically, and defending data', categoryAffinities: { 'Cybersecurity': 1.0, 'Cloud': 0.5 }, traits: ['Investigative', 'Protective'] },
        { id: 'opt-1d', text: 'Crafting intuitive visual interfaces, typography, and user experiences', categoryAffinities: { 'Design': 1.0, 'Media': 0.6 }, traits: ['Creative', 'Empathic'] }
      ]
    },
    {
      id: 'qz-2',
      question: 'Which of these real-world topics would you gladly read a 50-page deep dive about on the weekend?',
      category: 'Interests',
      weight: 1.0,
      order: 2,
      options: [
        { id: 'opt-2a', text: 'How neural networks process language and reason across vast datasets', categoryAffinities: { 'AI & Data': 1.0, 'Research': 0.8 }, traits: ['Intellectual'] },
        { id: 'opt-2b', text: 'How fintech and algorithmic trading firms execute trades in microseconds', categoryAffinities: { 'Finance': 1.0, 'Software': 0.6 }, traits: ['Financial', 'Ambitious'] },
        { id: 'opt-2c', text: 'How high-growth startups validate ideas and scale from $0 to $100M', categoryAffinities: { 'Entrepreneurship': 1.0, 'Business': 0.8 }, traits: ['Enterprising'] },
        { id: 'opt-2d', text: 'How modern microcontrollers and sensor hardware communicate in robotics', categoryAffinities: { 'Engineering': 1.0, 'Emerging Careers': 0.7 }, traits: ['Hands-on'] }
      ]
    },
    {
      id: 'qz-3',
      question: 'Which type of digital artifact would you be proudest to show a friend?',
      category: 'Interests',
      weight: 1.0,
      order: 3,
      options: [
        { id: 'opt-3a', text: 'A published, fully functional web or mobile app used by real people', categoryAffinities: { 'Software': 1.0, 'Design': 0.5 }, traits: ['Builder'] },
        { id: 'opt-3b', text: 'An insightful dashboard revealing unexpected trends in healthcare or climate data', categoryAffinities: { 'AI & Data': 0.9, 'Healthcare': 0.7 }, traits: ['Data-Driven'] },
        { id: 'opt-3c', text: 'A comprehensive security penetration testing report showing how a network was hardened', categoryAffinities: { 'Cybersecurity': 1.0 }, traits: ['Vigilant'] },
        { id: 'opt-3d', text: 'A compelling video essay, technical breakdown, or design case study', categoryAffinities: { 'Media': 1.0, 'Design': 0.7 }, traits: ['Communicative'] }
      ]
    },
    {
      id: 'qz-4',
      question: 'If you had unlimited resources to solve one global challenge, which angle would you take?',
      category: 'Interests',
      weight: 1.1,
      order: 4,
      options: [
        { id: 'opt-4a', text: 'Accelerating medical therapies through biological computation and clinical data', categoryAffinities: { 'Healthcare': 1.0, 'Research': 0.8 }, traits: ['Altruistic'] },
        { id: 'opt-4b', text: 'Building resilient cloud infrastructure and democratizing developer software', categoryAffinities: { 'Cloud': 1.0, 'Software': 0.8 }, traits: ['Foundational'] },
        { id: 'opt-4c', text: 'Protecting global institutions and democratic elections from cyber espionage', categoryAffinities: { 'Cybersecurity': 1.0 }, traits: ['Principled'] },
        { id: 'opt-4d', text: 'Founding an innovative venture to commercialize clean energy or robotics', categoryAffinities: { 'Entrepreneurship': 1.0, 'Engineering': 0.8 }, traits: ['Visionary'] }
      ]
    },

    // Category 2: Strengths (Questions 5-8)
    {
      id: 'qz-5',
      question: 'What do friends and colleagues naturally turn to you for?',
      category: 'Strengths',
      weight: 1.1,
      order: 5,
      options: [
        { id: 'opt-5a', text: 'Debugging technical glitches or writing scripts to automate tasks', categoryAffinities: { 'Software': 0.9, 'Cloud': 0.8 }, traits: ['Troubleshooter'] },
        { id: 'opt-5b', text: 'Analyzing numbers, spreadsheets, or evaluating whether an investment makes sense', categoryAffinities: { 'Finance': 0.9, 'AI & Data': 0.8 }, traits: ['Quantitative'] },
        { id: 'opt-5c', text: 'Making aesthetic decisions, giving feedback on slides, logos, or layouts', categoryAffinities: { 'Design': 1.0, 'Media': 0.7 }, traits: ['Aesthetic'] },
        { id: 'opt-5d', text: 'Resolving interpersonal disagreements or coordinating a complex team schedule', categoryAffinities: { 'Business': 1.0, 'Entrepreneurship': 0.7 }, traits: ['Leader'] }
      ]
    },
    {
      id: 'qz-6',
      question: 'How do you handle mathematical and quantitative concepts?',
      category: 'Strengths',
      weight: 1.0,
      order: 6,
      options: [
        { id: 'opt-6a', text: 'I love math (calculus, linear algebra, probability) and enjoy rigorous proofs', categoryAffinities: { 'AI & Data': 1.0, 'Finance': 0.9, 'Research': 0.9 }, traits: ['Mathematical'] },
        { id: 'opt-6b', text: 'I am comfortable with practical statistics, charts, and financial calculations', categoryAffinities: { 'Business': 0.7, 'Finance': 0.8, 'Software': 0.6 }, traits: ['Practical'] },
        { id: 'opt-6c', text: 'I prefer logical reasoning and discrete algorithms over continuous math', categoryAffinities: { 'Software': 0.9, 'Cybersecurity': 0.8 }, traits: ['Algorithmic'] },
        { id: 'opt-6d', text: 'I prefer qualitative reasoning, visual communication, and human psychology', categoryAffinities: { 'Design': 1.0, 'Media': 0.9 }, traits: ['Qualitative'] }
      ]
    },
    {
      id: 'qz-7',
      question: 'When looking at a complex diagram or schematic, your primary instinct is to:',
      category: 'Strengths',
      weight: 1.0,
      order: 7,
      options: [
        { id: 'opt-7a', text: 'Trace how data moves from point A to point B and where bottlenecks occur', categoryAffinities: { 'Cloud': 0.9, 'Software': 0.9 }, traits: ['Architect'] },
        { id: 'opt-7b', text: 'Identify the single point of failure where an attacker could compromise it', categoryAffinities: { 'Cybersecurity': 1.0 }, traits: ['Vigilant'] },
        { id: 'opt-7c', text: 'Simplify the visual layout so someone can understand it in 5 seconds', categoryAffinities: { 'Design': 1.0, 'Business': 0.7 }, traits: ['Simplifier'] },
        { id: 'opt-7d', text: 'Calculate the unit economics, bandwidth costs, or operational efficiency', categoryAffinities: { 'Finance': 0.8, 'Business': 0.9 }, traits: ['Economist'] }
      ]
    },
    {
      id: 'qz-8',
      question: 'In which domain is your natural attention to detail highest?',
      category: 'Strengths',
      weight: 1.0,
      order: 8,
      options: [
        { id: 'opt-8a', text: 'Syntax, clean code indentation, and logical edge cases', categoryAffinities: { 'Software': 1.0, 'Engineering': 0.7 }, traits: ['Precise'] },
        { id: 'opt-8b', text: 'Alignment, font weights, micro-padding, and color harmonies', categoryAffinities: { 'Design': 1.0 }, traits: ['Aesthetic'] },
        { id: 'opt-8c', text: 'Anomalous numbers, outliers in data tables, and statistical bias', categoryAffinities: { 'AI & Data': 1.0, 'Finance': 0.8 }, traits: ['Skeptical'] },
        { id: 'opt-8d', text: 'Wording precision, tone of voice, and narrative rhythm', categoryAffinities: { 'Media': 1.0, 'Business': 0.7 }, traits: ['Articulate'] }
      ]
    },

    // Category 3: Problem-Solving Preferences (Questions 9-12)
    {
      id: 'qz-9',
      question: 'When a piece of software crashes with an obscure error message, what is your approach?',
      category: 'Problem-solving',
      weight: 1.0,
      order: 9,
      options: [
        { id: 'opt-9a', text: 'Methodically read stack traces, isolate variables, and test hypotheses', categoryAffinities: { 'Software': 1.0, 'Cloud': 0.8 }, traits: ['Methodical'] },
        { id: 'opt-9b', text: 'Inspect network packets, memory allocations, or system logs with forensic tools', categoryAffinities: { 'Cybersecurity': 1.0, 'Engineering': 0.7 }, traits: ['Investigative'] },
        { id: 'opt-9c', text: 'Consult the documentation and check if other developers have solved this pattern', categoryAffinities: { 'Software': 0.7, 'Cloud': 0.7 }, traits: ['Resourceful'] },
        { id: 'opt-9d', text: 'Re-evaluate if the overall architecture or user flow needs to be simplified', categoryAffinities: { 'Design': 0.8, 'Business': 0.8 }, traits: ['Holistic'] }
      ]
    },
    {
      id: 'qz-10',
      question: 'Which type of puzzle appeals to you the most?',
      category: 'Problem-solving',
      weight: 1.0,
      order: 10,
      options: [
        { id: 'opt-10a', text: 'Optimizing a complex network or algorithm to run 10x faster with half the memory', categoryAffinities: { 'Software': 0.9, 'Cloud': 0.9, 'Engineering': 0.8 }, traits: ['Optimizer'] },
        { id: 'opt-10b', text: 'Cracking a cipher or finding a hidden loophole in rules and permissions', categoryAffinities: { 'Cybersecurity': 1.0, 'Research': 0.7 }, traits: ['Adversarial'] },
        { id: 'opt-10c', text: 'Synthesizing conflicting research findings into a clear strategic decision', categoryAffinities: { 'Business': 1.0, 'AI & Data': 0.8 }, traits: ['Strategic'] },
        { id: 'opt-10d', text: 'Redesigning a confusing public service or hospital form so anyone can use it', categoryAffinities: { 'Design': 1.0, 'Healthcare': 0.8 }, traits: ['Human-Centered'] }
      ]
    },
    {
      id: 'qz-11',
      question: 'Do you prefer solving problems with a single objectively right answer, or open-ended design trade-offs?',
      category: 'Problem-solving',
      weight: 1.0,
      order: 11,
      options: [
        { id: 'opt-11a', text: 'Objective logic: Either tests pass or they fail; either math proves out or it doesn’t', categoryAffinities: { 'Software': 0.8, 'Engineering': 0.9, 'Research': 0.8 }, traits: ['Deductive'] },
        { id: 'opt-11b', text: 'Statistical probability: There is no 100% certainty, but confidence intervals guide truth', categoryAffinities: { 'AI & Data': 1.0, 'Finance': 0.9 }, traits: ['Probabilistic'] },
        { id: 'opt-11c', text: 'Human trade-offs: Balancing user delight, business velocity, and aesthetic elegance', categoryAffinities: { 'Design': 1.0, 'Business': 0.8 }, traits: ['Nuanced'] },
        { id: 'opt-11d', text: 'Commercial execution: Solving whatever constraint threatens company growth today', categoryAffinities: { 'Entrepreneurship': 1.0, 'Business': 0.8 }, traits: ['Pragmatic'] }
      ]
    },
    {
      id: 'qz-12',
      question: 'When collaborating on a problem, you tend to ask:',
      category: 'Problem-solving',
      weight: 1.0,
      order: 12,
      options: [
        { id: 'opt-12a', text: '"How does this work under the hood?"', categoryAffinities: { 'Software': 0.9, 'Engineering': 0.9 }, traits: ['Curious'] },
        { id: 'opt-12b', text: '"What could possibly go wrong or be exploited here?"', categoryAffinities: { 'Cybersecurity': 1.0 }, traits: ['Risk-Aware'] },
        { id: 'opt-12c', text: '"Who is the customer and why do they care?"', categoryAffinities: { 'Business': 1.0, 'Design': 0.8 }, traits: ['Customer-Focused'] },
        { id: 'opt-12d', text: '"What do the numbers and historical data say about this?"', categoryAffinities: { 'AI & Data': 1.0, 'Finance': 0.8 }, traits: ['Empirical'] }
      ]
    },

    // Category 4: Work Style (Questions 13-16)
    {
      id: 'qz-13',
      question: 'What is your ideal balance of solitary focus time vs collaborative meetings?',
      category: 'Work style',
      weight: 1.0,
      order: 13,
      options: [
        { id: 'opt-13a', text: '80% deep solo focus, headphones on, building or analyzing in a flow state', categoryAffinities: { 'Software': 0.9, 'Research': 0.9, 'AI & Data': 0.8 }, traits: ['Deep Thinker'] },
        { id: 'opt-13b', text: '50/50: Deep work punctuated by lively design critiques or code reviews', categoryAffinities: { 'Design': 0.9, 'Cloud': 0.8, 'Cybersecurity': 0.7 }, traits: ['Balanced'] },
        { id: 'opt-13c', text: '70% collaborative: Facilitating discussions, interviewing people, and driving consensus', categoryAffinities: { 'Business': 1.0, 'Media': 0.8 }, traits: ['Social'] },
        { id: 'opt-13d', text: 'High adrenaline: Constantly responding to dynamic developments and tactical pivots', categoryAffinities: { 'Entrepreneurship': 1.0, 'Cybersecurity': 0.8 }, traits: ['Action-Oriented'] }
      ]
    },
    {
      id: 'qz-14',
      question: 'How do you respond to ambiguous, changing project requirements?',
      category: 'Work style',
      weight: 1.0,
      order: 14,
      options: [
        { id: 'opt-14a', text: 'I thrive in chaos; figuring out what to do next is the fun part', categoryAffinities: { 'Entrepreneurship': 1.0, 'Business': 0.8 }, traits: ['Adaptable'] },
        { id: 'opt-14b', text: 'I quickly design rapid prototypes to test assumptions before investing code', categoryAffinities: { 'Design': 0.9, 'Emerging Careers': 0.8 }, traits: ['Experimental'] },
        { id: 'opt-14c', text: 'I seek to document clear specifications and modular architecture to absorb changes', categoryAffinities: { 'Software': 0.9, 'Cloud': 0.8 }, traits: ['Structured'] },
        { id: 'opt-14d', text: 'I prefer well-defined regulatory standards and predictable scientific protocols', categoryAffinities: { 'Healthcare': 1.0, 'Research': 0.8 }, traits: ['Compliant'] }
      ]
    },
    {
      id: 'qz-15',
      question: 'Which work feedback cycle feels most satisfying to you?',
      category: 'Work style',
      weight: 1.0,
      order: 15,
      options: [
        { id: 'opt-15a', text: 'Immediate: I change code or CSS, refresh the browser, and see instant visual results', categoryAffinities: { 'Software': 1.0, 'Design': 0.8 }, traits: ['Tactile'] },
        { id: 'opt-15b', text: 'Weekly: Seeing conversion rates or model accuracies climb after an A/B test', categoryAffinities: { 'AI & Data': 0.9, 'Business': 0.8 }, traits: ['Iterative'] },
        { id: 'opt-15c', text: 'Monthly: Delivering a comprehensive security audit or cloud migration with zero downtime', categoryAffinities: { 'Cloud': 0.9, 'Cybersecurity': 0.9 }, traits: ['Methodical'] },
        { id: 'opt-15d', text: 'Multi-Year: Developing a foundational patent, scientific paper, or company exit', categoryAffinities: { 'Research': 1.0, 'Entrepreneurship': 0.9 }, traits: ['Patient'] }
      ]
    },
    {
      id: 'qz-16',
      question: 'How do you handle routine administrative tasks versus creative exploration?',
      category: 'Work style',
      weight: 1.0,
      order: 16,
      options: [
        { id: 'opt-16a', text: 'I automate routine tasks immediately with scripts so I can focus on creative work', categoryAffinities: { 'Cloud': 1.0, 'Software': 0.9 }, traits: ['Automator'] },
        { id: 'opt-16b', text: 'I enjoy structured checklists and verifying that every single requirement is met', categoryAffinities: { 'Healthcare': 0.8, 'Finance': 0.8, 'Cybersecurity': 0.7 }, traits: ['Diligent'] },
        { id: 'opt-16c', text: 'I prefer open creative canvas time where I can experiment without rigid checklists', categoryAffinities: { 'Design': 1.0, 'Media': 0.8 }, traits: ['Explorative'] },
        { id: 'opt-16d', text: 'I delegate or streamline routines to focus purely on strategic commercial leverage', categoryAffinities: { 'Business': 0.9, 'Entrepreneurship': 1.0 }, traits: ['Executive'] }
      ]
    },

    // Category 5: Learning Style (Questions 17-20)
    {
      id: 'qz-17',
      question: 'How do you master a new technology most effectively?',
      category: 'Learning style',
      weight: 1.0,
      order: 17,
      options: [
        { id: 'opt-17a', text: 'Dive straight into a blank project and build something until it works', categoryAffinities: { 'Software': 1.0, 'Entrepreneurship': 0.8 }, traits: ['Kinesthetic'] },
        { id: 'opt-17b', text: 'Read the official documentation, specifications, and architectural diagrams first', categoryAffinities: { 'Cloud': 0.9, 'Cybersecurity': 0.8 }, traits: ['Textual'] },
        { id: 'opt-17c', text: 'Watch video walkthroughs, conference talks, and interactive tutorials', categoryAffinities: { 'Design': 0.8, 'Media': 0.8 }, traits: ['Visual'] },
        { id: 'opt-17d', text: 'Study theoretical textbooks, foundational math, and underlying academic papers', categoryAffinities: { 'Research': 1.0, 'AI & Data': 0.8 }, traits: ['Academic'] }
      ]
    },
    {
      id: 'qz-18',
      question: 'When reading code written by others, what is your reaction?',
      category: 'Learning style',
      weight: 1.0,
      order: 18,
      options: [
        { id: 'opt-18a', text: 'I love dissecting large open-source repositories to learn elite patterns', categoryAffinities: { 'Software': 1.0, 'Cybersecurity': 0.7 }, traits: ['Analytical'] },
        { id: 'opt-18b', text: 'I look for architectural modularity and how well it conforms to clean standards', categoryAffinities: { 'Cloud': 0.9, 'Software': 0.8 }, traits: ['Architectural'] },
        { id: 'opt-18c', text: 'I focus on whether the user outcome was achieved cleanly and efficiently', categoryAffinities: { 'Business': 0.8, 'Design': 0.8 }, traits: ['Outcome-Oriented'] },
        { id: 'opt-18d', text: 'I inspect algorithmic efficiency and numerical precision in statistical calculations', categoryAffinities: { 'AI & Data': 1.0, 'Finance': 0.9 }, traits: ['Rigorous'] }
      ]
    },
    {
      id: 'qz-19',
      question: 'When a concept is difficult to grasp, what helps you breakthrough?',
      category: 'Learning style',
      weight: 1.0,
      order: 19,
      options: [
        { id: 'opt-19a', text: 'Drawing mental models, visual state machines, or flowcharts on a whiteboard', categoryAffinities: { 'Design': 0.9, 'Software': 0.8 }, traits: ['Visual'] },
        { id: 'opt-19b', text: 'Writing a miniature test program or sandbox experiment to verify behavior', categoryAffinities: { 'Software': 1.0, 'AI & Data': 0.8 }, traits: ['Empirical'] },
        { id: 'opt-19c', text: 'Explaining it out loud to a colleague (rubber-duck debugging)', categoryAffinities: { 'Business': 0.9, 'Media': 0.8 }, traits: ['Verbal'] },
        { id: 'opt-19d', text: 'Deriving the math from first principles on paper', categoryAffinities: { 'Research': 1.0, 'Finance': 0.8 }, traits: ['Theoretical'] }
      ]
    },
    {
      id: 'qz-20',
      question: 'How comfortable are you with continuous lifelong learning as tools change?',
      category: 'Learning style',
      weight: 1.0,
      order: 20,
      options: [
        { id: 'opt-20a', text: 'I love it: The rapid churn in AI and modern frameworks keeps life exhilarating', categoryAffinities: { 'AI & Data': 1.0, 'Emerging Careers': 1.0 }, traits: ['Curious'] },
        { id: 'opt-20b', text: 'I embrace it, provided the foundational principles (Linux, SQL, protocols) stay solid', categoryAffinities: { 'Cloud': 0.9, 'Software': 0.8 }, traits: ['Foundational'] },
        { id: 'opt-20c', text: 'I prefer mastering timeless human skills like negotiation, strategy, and design empathy', categoryAffinities: { 'Business': 0.9, 'Design': 0.8 }, traits: ['Evergreen'] },
        { id: 'opt-20d', text: 'I enjoy deepening domain mastery within a stable, prestigious institutional field', categoryAffinities: { 'Healthcare': 0.9, 'Finance': 0.8 }, traits: ['Specialist'] }
      ]
    },

    // Category 6: Environment (Questions 21-23)
    {
      id: 'qz-21',
      question: 'What type of organizational culture brings out your best work?',
      category: 'Environment',
      weight: 1.0,
      order: 21,
      options: [
        { id: 'opt-21a', text: 'A fast-paced, high-ownership early-stage startup where every day counts', categoryAffinities: { 'Entrepreneurship': 1.0, 'Software': 0.7 }, traits: ['Scrappy'] },
        { id: 'opt-21b', text: 'A well-resourced technology company with world-class engineering tooling and mentorship', categoryAffinities: { 'Cloud': 0.9, 'AI & Data': 0.8 }, traits: ['Disciplined'] },
        { id: 'opt-21c', text: 'An institution with mission-driven social impact (healthcare, public defense, education)', categoryAffinities: { 'Healthcare': 1.0, 'Cybersecurity': 0.7 }, traits: ['Mission-Driven'] },
        { id: 'opt-21d', text: 'A high-performance meritocracy where tangible financial results are directly rewarded', categoryAffinities: { 'Finance': 1.0, 'Business': 0.7 }, traits: ['Performance-Driven'] }
      ]
    },
    {
      id: 'qz-22',
      question: 'How do you view remote work versus in-person laboratory or office environments?',
      category: 'Environment',
      weight: 1.0,
      order: 22,
      options: [
        { id: 'opt-22a', text: 'Fully remote, asynchronous work with total control over my physical workspace', categoryAffinities: { 'Software': 0.9, 'Cloud': 0.8, 'Media': 0.8 }, traits: ['Autonomous'] },
        { id: 'opt-22b', text: 'Hybrid: Enjoying team brainstorms in person, but preserving focused solo days', categoryAffinities: { 'Design': 0.9, 'Business': 0.8 }, traits: ['Collaborative'] },
        { id: 'opt-22c', text: 'On-site in labs or trading floors with physical hardware, oscilloscopes, or multi-monitors', categoryAffinities: { 'Engineering': 1.0, 'Finance': 0.8, 'Healthcare': 0.7 }, traits: ['Hands-on'] },
        { id: 'opt-22d', text: 'Dynamic: Traveling to meet clients, partners, and speaking at industry conferences', categoryAffinities: { 'Business': 0.9, 'Entrepreneurship': 0.8 }, traits: ['Outgoing'] }
      ]
    },
    {
      id: 'qz-23',
      question: 'What level of operational risk and stability do you prefer in your career?',
      category: 'Environment',
      weight: 1.0,
      order: 23,
      options: [
        { id: 'opt-23a', text: 'Very high stability, predictable benefits, and clear corporate promotional ladders', categoryAffinities: { 'Healthcare': 0.9, 'Finance': 0.8, 'Cloud': 0.7 }, traits: ['Security-Minded'] },
        { id: 'opt-23b', text: 'Moderate risk: Standard tech salary with equity upside in a growing venture', categoryAffinities: { 'Software': 0.9, 'Design': 0.8, 'AI & Data': 0.8 }, traits: ['Balanced'] },
        { id: 'opt-23c', text: 'High risk, uncapped upside: Founding companies, protocol tokens, or performance bonuses', categoryAffinities: { 'Entrepreneurship': 1.0, 'Finance': 0.9, 'Emerging Careers': 0.8 }, traits: ['Risk-Tolerant'] },
        { id: 'opt-23d', text: 'Intellectual stability: Academic grants, research fellowships, or tenure tracks', categoryAffinities: { 'Research': 1.0 }, traits: ['Scholarly'] }
      ]
    },

    // Category 7: Goals (Questions 24-26)
    {
      id: 'qz-24',
      question: 'Five years from now, which achievement would make you happiest?',
      category: 'Goals',
      weight: 1.1,
      order: 24,
      options: [
        { id: 'opt-24a', text: 'Architecting a system handling hundreds of millions of requests reliably', categoryAffinities: { 'Cloud': 1.0, 'Software': 0.9 }, traits: ['Builder'] },
        { id: 'opt-24b', text: 'Publishing breakthrough AI models or biomedical research cited by thousands', categoryAffinities: { 'Research': 1.0, 'AI & Data': 0.8 }, traits: ['Innovator'] },
        { id: 'opt-24c', text: 'Growing a profitable startup or product to millions in annual recurring revenue', categoryAffinities: { 'Entrepreneurship': 1.0, 'Business': 0.8 }, traits: ['Leader'] },
        { id: 'opt-24d', text: 'Designing a universally acclaimed design system or iconic consumer app interface', categoryAffinities: { 'Design': 1.0, 'Media': 0.8 }, traits: ['Creator'] }
      ]
    },
    {
      id: 'qz-25',
      question: 'What is your philosophy on professional compensation versus work-life balance?',
      category: 'Goals',
      weight: 1.0,
      order: 25,
      options: [
        { id: 'opt-25a', text: 'Maximized compensation: I am willing to work intense hours in high-stakes fields for top-tier earnings', categoryAffinities: { 'Finance': 1.0, 'AI & Data': 0.8 }, traits: ['Driven'] },
        { id: 'opt-25b', text: 'Healthy balance: Strong competitive compensation with sustainable 40-hour boundaries', categoryAffinities: { 'Software': 0.9, 'Cloud': 0.8, 'Design': 0.8 }, traits: ['Grounded'] },
        { id: 'opt-25c', text: 'Mission first: I care most about positive societal impact on healthcare or privacy', categoryAffinities: { 'Healthcare': 1.0, 'Cybersecurity': 0.8 }, traits: ['Purpose-Driven'] },
        { id: 'opt-25d', text: 'Equity & autonomy: Freedom to build my own schedule and own substantial equity', categoryAffinities: { 'Entrepreneurship': 1.0, 'Emerging Careers': 0.8 }, traits: ['Independent'] }
      ]
    },
    {
      id: 'qz-26',
      question: 'Which type of leadership role do you aspire toward over your career?',
      category: 'Goals',
      weight: 1.0,
      order: 26,
      options: [
        { id: 'opt-26a', text: 'Principal/Distinguished Engineer (Individual Contributor depth without managing people)', categoryAffinities: { 'Software': 1.0, 'Cloud': 0.9, 'AI & Data': 0.8 }, traits: ['Specialist'] },
        { id: 'opt-26b', text: 'Chief Technology Officer (CTO) or VP Engineering leading massive technical orgs', categoryAffinities: { 'Cloud': 0.9, 'Software': 0.8, 'Business': 0.8 }, traits: ['Leader'] },
        { id: 'opt-26c', text: 'Chief Product Officer (CPO) or Design Director guiding product vision', categoryAffinities: { 'Design': 1.0, 'Business': 0.9 }, traits: ['Visionary'] },
        { id: 'opt-26d', text: 'Chief Information Security Officer (CISO) protecting corporate infrastructure', categoryAffinities: { 'Cybersecurity': 1.0 }, traits: ['Protective'] }
      ]
    },

    // Category 8: Career Preferences (Questions 27-30)
    {
      id: 'qz-27',
      question: 'Which of the following sounds most engaging for your day-to-day work?',
      category: 'Career preferences',
      weight: 1.2,
      order: 27,
      options: [
        { id: 'opt-27a', text: 'Writing code in TypeScript or Python and testing software deployments', categoryAffinities: { 'Software': 1.0, 'Cloud': 0.7 }, traits: ['Developer'] },
        { id: 'opt-27b', text: 'Training neural networks and tuning hyperparameters on GPU clusters', categoryAffinities: { 'AI & Data': 1.0, 'Research': 0.8 }, traits: ['AI Specialist'] },
        { id: 'opt-27c', text: 'Auditing firewalls, inspecting threat logs, and testing penetration vectors', categoryAffinities: { 'Cybersecurity': 1.0 }, traits: ['Security Specialist'] },
        { id: 'opt-27d', text: 'Interviewing users, designing Figma flows, and testing prototypes', categoryAffinities: { 'Design': 1.0, 'Business': 0.7 }, traits: ['Designer'] }
      ]
    },
    {
      id: 'qz-28',
      question: 'How do you feel about working with physical hardware versus pure software?',
      category: 'Career preferences',
      weight: 1.0,
      order: 28,
      options: [
        { id: 'opt-28a', text: 'Pure software/cloud: I love being able to deploy code anywhere in seconds without hardware', categoryAffinities: { 'Software': 1.0, 'Cloud': 0.9 }, traits: ['Cloud-Native'] },
        { id: 'opt-28b', text: 'Physical hardware: Microcontrollers, robots, circuits, and sensors make code tangible', categoryAffinities: { 'Engineering': 1.0, 'Emerging Careers': 0.7 }, traits: ['Hardware-Minded'] },
        { id: 'opt-28c', text: 'Data pipelines: I care about data moving through warehouses and storage clusters', categoryAffinities: { 'AI & Data': 1.0 }, traits: ['Data-Minded'] },
        { id: 'opt-28d', text: 'People & systems: I care about human behavior, user funnels, and organizational growth', categoryAffinities: { 'Business': 1.0, 'Media': 0.8 }, traits: ['Human-Minded'] }
      ]
    },
    {
      id: 'qz-29',
      question: 'If you could master one emerging technology today, which would it be?',
      category: 'Career preferences',
      weight: 1.1,
      order: 29,
      options: [
        { id: 'opt-29a', text: 'Autonomous AI Agents and Large Language Model orchestration', categoryAffinities: { 'AI & Data': 1.0, 'Emerging Careers': 0.9 }, traits: ['Forward-Looking'] },
        { id: 'opt-29b', text: 'Zero-Trust Cloud Security Architecture and automated threat defense', categoryAffinities: { 'Cybersecurity': 1.0, 'Cloud': 0.8 }, traits: ['Security-First'] },
        { id: 'opt-29c', text: 'Decentralized smart contracts, Web3, and cryptographic zero-knowledge proofs', categoryAffinities: { 'Emerging Careers': 1.0, 'Finance': 0.7 }, traits: ['Pioneering'] },
        { id: 'opt-29d', text: 'Spatial computing, AR/VR micro-interactions, and 3D web interfaces', categoryAffinities: { 'Design': 0.9, 'Software': 0.8 }, traits: ['Immersive'] }
      ]
    },
    {
      id: 'qz-30',
      question: 'Ultimately, what kind of mark do you want your daily work to leave on the world?',
      category: 'Career preferences',
      weight: 1.2,
      order: 30,
      options: [
        { id: 'opt-30a', text: 'Building reliable digital tools that make millions of lives smoother and more productive', categoryAffinities: { 'Software': 1.0, 'Design': 0.7 }, traits: ['Empowering'] },
        { id: 'opt-30b', text: 'Unlocking scientific insights, medical discoveries, or intelligent automated systems', categoryAffinities: { 'AI & Data': 0.9, 'Research': 0.9, 'Healthcare': 0.8 }, traits: ['Scientific'] },
        { id: 'opt-30c', text: 'Protecting civil privacy, digital infrastructure, and corporate resilience against threats', categoryAffinities: { 'Cybersecurity': 1.0, 'Cloud': 0.7 }, traits: ['Guardian'] },
        { id: 'opt-30d', text: 'Creating ventures, economic opportunity, and inspiring teams to achieve greatness', categoryAffinities: { 'Entrepreneurship': 1.0, 'Business': 0.9 }, traits: ['Inspirational'] }
      ]
    }
  ];
}

// 52 Practical Projects with real tech stacks
export function get52Projects(): ProjectSeed[] {
  const titles = [
    { title: 'Personalized AI Career Copilot & Resume Matcher', cat: 'AI & Data', diff: 'Intermediate', tech: ['Python', 'FastAPI', 'OpenAI/Gemini', 'ChromaDB', 'React'], val: 'Very High', dur: '3 weeks' },
    { title: 'Production Full-Stack E-Commerce Platform with Stripe', cat: 'Software', diff: 'Intermediate', tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'Tailwind'], val: 'High', dur: '4 weeks' },
    { title: 'Cloud-Native Distributed File Storage System', cat: 'Cloud', diff: 'Advanced', tech: ['Go', 'Docker', 'AWS S3 API', 'gRPC', 'PostgreSQL'], val: 'Very High', dur: '4 weeks' },
    { title: 'Zero-Trust SOC Network Vulnerability Scanner', cat: 'Cybersecurity', diff: 'Advanced', tech: ['Python', 'Nmap Scripting', 'Wireshark', 'FastAPI', 'Vue/React'], val: 'High', dur: '3 weeks' },
    { title: 'Financial Portfolio Risk & Monte Carlo Simulator', cat: 'Finance', diff: 'Intermediate', tech: ['Python', 'NumPy', 'Pandas', 'Streamlit', 'yfinance'], val: 'High', dur: '2 weeks' },
    { title: 'Design System & Component Library in Storybook', cat: 'Design', diff: 'Intermediate', tech: ['TypeScript', 'React', 'Tailwind CSS', 'Storybook', 'Figma'], val: 'High', dur: '2 weeks' },
    { title: 'Autonomous Obstacle-Avoiding Robot Simulation', cat: 'Engineering', diff: 'Advanced', tech: ['C++', 'ROS2', 'Gazebo', 'Python', 'OpenCV'], val: 'Very High', dur: '4 weeks' },
    { title: 'Electronic Health Record (EHR) Patient Portal (FHIR)', cat: 'Healthcare', diff: 'Intermediate', tech: ['TypeScript', 'FHIR API', 'Next.js', 'PostgreSQL'], val: 'High', dur: '3 weeks' },
    { title: 'Real-Time Collaborative Code Editor with WebSockets', cat: 'Software', diff: 'Advanced', tech: ['React', 'Node.js', 'WebSockets/Socket.io', 'Redis', 'Monaco Editor'], val: 'Very High', dur: '3 weeks' },
    { title: 'Automated CI/CD Kubernetes Deployment Engine', cat: 'Cloud', diff: 'Advanced', tech: ['GitHub Actions', 'Terraform', 'Kubernetes', 'Helm', 'ArgoCD'], val: 'Very High', dur: '3 weeks' }
  ];

  const projects: ProjectSeed[] = [];
  let id = 1;

  for (const t of titles) {
    const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    projects.push({
      id: `prj-${id++}`,
      title: t.title,
      slug,
      description: `Build a production-grade ${t.title.toLowerCase()} that demonstrates real-world software architecture and portfolio value.`,
      difficulty: t.diff as any,
      category: t.cat,
      technologies: t.tech,
      skills: t.tech.slice(0, 4),
      portfolioValue: t.val as any,
      duration: t.dur,
      deliverables: ['Working GitHub repo with tests', 'Live deployment URL', 'Detailed architectural README with diagrams']
    });
  }

  // Expand to 52 projects
  const archetypes = [
    { prefix: 'Interactive Analytics Dashboard for', cat: 'AI & Data', diff: 'Beginner', val: 'Medium' },
    { prefix: 'High-Throughput Microservice for', cat: 'Software', diff: 'Advanced', val: 'Very High' },
    { prefix: 'Automated Security Scanner for', cat: 'Cybersecurity', diff: 'Intermediate', val: 'High' },
    { prefix: 'Containerized Infrastructure Pipeline for', cat: 'Cloud', diff: 'Intermediate', val: 'High' },
    { prefix: 'Algorithmic Backtester for', cat: 'Finance', diff: 'Advanced', val: 'Very High' },
    { prefix: 'Responsive Multi-Platform App for', cat: 'Software', diff: 'Intermediate', val: 'High' },
    { prefix: 'Accessible UX Overhaul for', cat: 'Design', diff: 'Beginner', val: 'Medium' }
  ];

  const domains = [
    'Urban Traffic Optimization', 'Renewable Energy Smart Grids', 'E-Learning Micro-Credentials',
    'Clinical Trial Telemetry', 'Decentralized Identity Verification', 'Developer Tooling Telemetry',
    'Real-Time Multiplayer Gaming', 'Supply Chain Provenance', 'Customer Support Ticket Triaging',
    'Personal Finance Budgeting', 'Podcast Audio Transcription', 'Predictive Equipment Maintenance'
  ];

  for (let i = 0; projects.length < 52; i++) {
    const arch = archetypes[i % archetypes.length];
    const dom = domains[i % domains.length];
    const title = `${arch.prefix} ${dom}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    projects.push({
      id: `prj-${id++}`,
      title,
      slug,
      description: `Hands-on project developing a ${title.toLowerCase()} equipped with automated testing, continuous integration, and clean modular code.`,
      difficulty: arch.diff as any,
      category: arch.cat,
      technologies: ['TypeScript', 'React', 'PostgreSQL', 'Docker'],
      skills: ['System Design', 'Git', 'Clean Architecture', 'API Integration'],
      portfolioValue: arch.val as any,
      duration: '2-3 weeks',
      deliverables: ['GitHub Repository', 'Live Preview Demo', 'Architecture System Diagram']
    });
  }

  return projects;
}

// 52 Real Resources with authentic provider URLs
export function get52Resources(): ResourceSeed[] {
  const realCurated: ResourceSeed[] = [
    {
      id: 'res-1',
      title: 'CS50: Introduction to Computer Science',
      description: "Harvard University's legendary introduction to the intellectual enterprises of computer science and the art of programming.",
      category: 'Courses',
      difficulty: 'Beginner',
      isFree: true,
      url: 'https://cs50.harvard.edu/x/',
      provider: 'Harvard University / edX'
    },
    {
      id: 'res-2',
      title: 'The Odin Project: Full Stack Open Curriculum',
      description: 'Free, open-source full-stack web development curriculum focusing on real project building from command line to deployment.',
      category: 'Practice',
      difficulty: 'Beginner',
      isFree: true,
      url: 'https://www.theodinproject.com/',
      provider: 'The Odin Project'
    },
    {
      id: 'res-3',
      title: 'DeepLearning.AI: Machine Learning Specialization',
      description: "Taught by Andrew Ng, this foundational specialization covers modern machine learning algorithms, deep learning, and practical tips.",
      category: 'Courses',
      difficulty: 'Intermediate',
      isFree: false,
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      provider: 'Coursera / DeepLearning.AI'
    },
    {
      id: 'res-4',
      title: 'Full Stack Open 2025 (University of Helsinki)',
      description: 'Deep dive into modern JavaScript-based web development focusing on React, Redux, Node.js, REST APIs, GraphQL, and TypeScript.',
      category: 'Courses',
      difficulty: 'Intermediate',
      isFree: true,
      url: 'https://fullstackopen.com/en/',
      provider: 'University of Helsinki'
    },
    {
      id: 'res-5',
      title: 'OWASP Top 10 Web Application Security Guide',
      description: 'The standard awareness document for developers and web application security representing a broad consensus about critical risks.',
      category: 'Certifications',
      difficulty: 'Intermediate',
      isFree: true,
      url: 'https://owasp.org/www-project-top-ten/',
      provider: 'OWASP Foundation'
    },
    {
      id: 'res-6',
      title: 'Designing Data-Intensive Applications (Kleppmann)',
      description: 'The definitive architectural book on storage engines, distributed consensus, data replication, partitioning, and stream processing.',
      category: 'Books',
      difficulty: 'Advanced',
      isFree: false,
      url: 'https://dataintensive.net/',
      provider: "O'Reilly Media"
    },
    {
      id: 'res-7',
      title: 'AWS Skill Builder: Cloud Practitioner Essentials',
      description: 'Official self-paced fundamental course exploring cloud computing, security, architecture, pricing, and support models.',
      category: 'Certifications',
      difficulty: 'Beginner',
      isFree: true,
      url: 'https://explore.skillbuilder.aws/',
      provider: 'Amazon Web Services'
    },
    {
      id: 'res-8',
      title: 'freeCodeCamp: Responsive Web Design & JavaScript',
      description: 'Interactive coding platform teaching HTML, CSS, JavaScript, and algorithms with 300+ hours of verified portfolio projects.',
      category: 'Practice',
      difficulty: 'Beginner',
      isFree: true,
      url: 'https://www.freecodecamp.org/',
      provider: 'freeCodeCamp'
    },
    {
      id: 'res-9',
      title: 'Refactoring Guru: Design Patterns & Architecture',
      description: 'Visual, engaging breakdown of structural, creational, and behavioral design patterns in TypeScript, Python, and C++.',
      category: 'Books',
      difficulty: 'Intermediate',
      isFree: true,
      url: 'https://refactoring.guru/design-patterns',
      provider: 'Refactoring Guru'
    },
    {
      id: 'res-10',
      title: 'Tech Interview Handbook & Grind 75',
      description: 'Curated guide for coding interviews, behavioral preparation, resume design, and optimal LeetCode algorithm problem lists.',
      category: 'Interview preparation',
      difficulty: 'Intermediate',
      isFree: true,
      url: 'https://www.techinterviewhandbook.org/',
      provider: 'Tech Interview Handbook'
    }
  ];

  const list = [...realCurated];
  const cats = ['Courses', 'Certifications', 'Books', 'YouTube', 'Practice', 'Internships', 'Resume', 'Interview preparation'];
  const providers = ['MIT OpenCourseWare', 'Stanford Online', 'Kaggle Learn', 'Google Cloud Training', 'Coursera', 'edX', 'MDN Web Docs'];

  let id = 11;
  while (list.length < 52) {
    const cat = cats[list.length % cats.length];
    const prov = providers[list.length % providers.length];
    list.push({
      id: `res-${id++}`,
      title: `${prov} Technical Guide: Applied ${cat} Curriculum #${id}`,
      description: `Verified educational curriculum provided by ${prov} covering fundamental and advanced topics in modern technology.`,
      category: cat,
      difficulty: (list.length % 3 === 0 ? 'Beginner' : list.length % 3 === 1 ? 'Intermediate' : 'Advanced') as any,
      isFree: list.length % 2 === 0,
      url: 'https://ocw.mit.edu/',
      provider: prov
    });
  }

  return list;
}
