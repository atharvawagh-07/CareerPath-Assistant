export interface CareerSeed {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  responsibilities: string[];
  education: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  demandLevel: 'Moderate' | 'High' | 'Very High';
  futureGrowth: string;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  tools: string[];
  industries: string[];
  pros: string[];
  cons: string[];
}

export interface SkillSeed {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  relatedCareers: string[];
}

export interface QuizQuestionSeed {
  id: string;
  question: string;
  category: string;
  weight: number;
  order: number;
  options: {
    id: string;
    text: string;
    categoryAffinities: Record<string, number>;
    traits: string[];
  }[];
}

export interface ProjectSeed {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  technologies: string[];
  skills: string[];
  portfolioValue: 'Medium' | 'High' | 'Very High';
  duration: string;
  deliverables: string[];
}

export interface ResourceSeed {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isFree: boolean;
  url: string;
  provider: string;
}

export const CAREER_CATEGORIES = [
  'AI & Data',
  'Software',
  'Cybersecurity',
  'Cloud',
  'Engineering',
  'Healthcare',
  'Finance',
  'Business',
  'Design',
  'Media',
  'Research',
  'Entrepreneurship',
  'Emerging Careers'
];

export const RAW_CAREERS: CareerSeed[] = [
  // 1. AI & Data
  {
    id: 'car-ai-engineer',
    title: 'AI/ML Engineer',
    slug: 'ai-ml-engineer',
    category: 'AI & Data',
    description: 'Designs and builds machine learning systems, neural networks, and generative AI applications to solve predictive tasks.',
    overview: 'AI & Machine Learning Engineers translate statistical theory and neural algorithms into resilient software services. You will train models, optimize inference pipelines, and integrate LLMs into software products.',
    responsibilities: ['Build & fine-tune machine learning and deep learning models', 'Design data pipelines and feature stores for training', 'Optimize model latency and inference throughput on GPUs/CPUs', 'Evaluate model drift, bias, and performance metrics'],
    education: "Bachelor's or Master's in Computer Science, Data Science, Math, or equivalent self-directed portfolio",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+38% over the next decade',
    salaryMin: 115000,
    salaryMax: 185000,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Linear Algebra', 'Data Structures', 'Model Deployment'],
    tools: ['Jupyter', 'Hugging Face', 'Docker', 'MLflow', 'Weights & Biases', 'CUDA'],
    industries: ['Tech', 'Automotive & Autonomous Systems', 'FinTech', 'Healthcare & Biotech'],
    pros: ['Exponential industry demand and premium salaries', 'Cutting-edge intellectual challenges', 'High impact on modern software innovations'],
    cons: ['Rapidly changing tooling requires continuous learning', 'Debugging non-deterministic model outcomes can be tedious']
  },
  {
    id: 'car-data-scientist',
    title: 'Data Scientist',
    slug: 'data-scientist',
    category: 'AI & Data',
    description: 'Extracts actionable insights and predictive signals from massive structured and unstructured datasets using statistical modeling.',
    overview: 'Data Scientists blend domain knowledge, statistical analysis, and programming to help organizations make high-conviction decisions and build automated prediction algorithms.',
    responsibilities: ['Formulate statistical hypotheses and conduct A/B testing', 'Clean, impute, and transform complex datasets', 'Develop predictive models and communicate findings with stakeholders', 'Design experimentation frameworks'],
    education: "Bachelor's or Master's in Statistics, Economics, CS, or Applied Mathematics",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+35% growth',
    salaryMin: 105000,
    salaryMax: 165000,
    skills: ['Python', 'R', 'SQL', 'Statistical Modeling', 'Hypothesis Testing', 'Data Visualization'],
    tools: ['Pandas', 'Scikit-Learn', 'Tableau', 'BigQuery', 'Snowflake'],
    industries: ['E-commerce', 'Financial Services', 'Consulting', 'Health Informatics'],
    pros: ['Direct influence on executive strategy', 'High transferability across diverse industries', 'Creative autonomy in analysis'],
    cons: ['Data quality issues often consume up to 70% of time', 'Need to constantly justify conclusions to non-technical partners']
  },
  {
    id: 'car-data-analyst',
    title: 'Data Analyst',
    slug: 'data-analyst',
    category: 'AI & Data',
    description: 'Transforms raw business data into actionable dashboards, KPIs, and operational reports.',
    overview: 'Data Analysts bridge business problems with data solutions. You query enterprise databases, build visual metrics dashboards, and identify market trends.',
    responsibilities: ['Write complex SQL queries for business reporting', 'Build interactive business intelligence dashboards', 'Analyze marketing, product, and financial funnels', 'Present weekly operational reviews'],
    education: "Bachelor's in Business Analytics, CS, Economics, or bootcamp equivalent",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+23% growth',
    salaryMin: 70000,
    salaryMax: 110000,
    skills: ['SQL', 'Data Visualization', 'Spreadsheet Modeling', 'Critical Thinking', 'Business Metrics'],
    tools: ['PowerBI', 'Tableau', 'Excel', 'PostgreSQL', 'Metabase'],
    industries: ['Retail', 'Marketing Agencies', 'Healthcare', 'Banking'],
    pros: ['Fast entry path into technology and data fields', 'Clear, tangible daily outputs', 'High business visibility'],
    cons: ['Repetitive ad-hoc query requests from stakeholders', 'Can feel transactional if not tied to strategic decisions']
  },
  {
    id: 'car-data-engineer',
    title: 'Data Engineer',
    slug: 'data-engineer',
    category: 'AI & Data',
    description: 'Architects reliable data pipelines, warehouses, and streaming engines that supply clean data at scale.',
    overview: 'Data Engineers build the plumbing for the modern data stack. You develop ETL/ELT pipelines, manage distributed databases, and guarantee data reliability for analysts and ML models.',
    responsibilities: ['Build distributed ETL batch and real-time streaming pipelines', 'Maintain data warehouse schemas and partitions', 'Monitor pipeline health, data contracts, and SLA compliance', 'Optimize database performance and cloud storage costs'],
    education: "Bachelor's in Computer Science, Software Engineering, or equivalent",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+30% growth',
    salaryMin: 110000,
    salaryMax: 175000,
    skills: ['SQL', 'Python', 'Distributed Systems', 'Data Warehousing', 'Data Modeling', 'APIs'],
    tools: ['Apache Spark', 'Apache Kafka', 'Airflow', 'dbt', 'Snowflake', 'BigQuery'],
    industries: ['SaaS', 'FinTech', 'Logistics', 'Social Media'],
    pros: ['Indispensable backbone of every data-driven company', 'Deep software engineering craftsmanship', 'Extremely high job security'],
    cons: ['On-call rotations when production pipelines break', 'Silent failures in source data can be hard to track']
  },

  // 2. Software
  {
    id: 'car-fullstack-dev',
    title: 'Full-Stack Software Engineer',
    slug: 'full-stack-software-engineer',
    category: 'Software',
    description: 'Builds complete end-to-end web applications, integrating intuitive user interfaces with robust backend APIs.',
    overview: 'Full-Stack Engineers handle everything from pixel-perfect UI rendering to database transactions, authentication flows, and server deployments.',
    responsibilities: ['Develop reactive client interfaces with modern web frameworks', 'Design RESTful and GraphQL backend endpoints', 'Implement database schemas, migrations, and ORM models', 'Write unit, integration, and end-to-end tests'],
    education: "Bachelor's in Computer Science, Software Engineering, or practical portfolio",
    difficulty: 'Intermediate',
    demandLevel: 'Very High',
    futureGrowth: '+25% growth',
    salaryMin: 95000,
    salaryMax: 160000,
    skills: ['JavaScript/TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'CSS Architecture'],
    tools: ['VS Code', 'Docker', 'Postman', 'Git', 'Vite', 'Tailwind CSS'],
    industries: ['Startups', 'Enterprise SaaS', 'Consumer Web', 'E-commerce'],
    pros: ['Ability to build complete products independently', 'Versatility in the job market', 'Immediate visual and functional feedback'],
    cons: ['Broad scope can make mastery of single sub-specialties harder', 'Rapid churn in web ecosystem libraries']
  },
  {
    id: 'car-frontend-dev',
    title: 'Frontend Engineer',
    slug: 'frontend-engineer',
    category: 'Software',
    description: 'Crafts responsive, accessible, and high-performance user interfaces for modern web and mobile apps.',
    overview: 'Frontend Engineers turn design prototypes into living interactive software. You optimize bundle sizes, render trees, and ensure accessibility across devices.',
    responsibilities: ['Build modular UI component libraries', 'Ensure Web Accessibility (WCAG AA/AAA compliance)', 'Manage client-side state and data synchronization', 'Benchmark Core Web Vitals and load performance'],
    education: "Bachelor's in CS, Design Computing, or self-taught web developer",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+22% growth',
    salaryMin: 90000,
    salaryMax: 150000,
    skills: ['TypeScript', 'React', 'CSS/Tailwind', 'Web Accessibility', 'State Management', 'Browser Performance'],
    tools: ['Figma', 'Vite', 'Chrome DevTools', 'Storybook', 'Jest'],
    industries: ['Consumer Apps', 'FinTech Portals', 'EdTech', 'Media'],
    pros: ['Creative satisfaction seeing users interact with your work', 'High demand for skilled UI specialists', 'Vibrant open-source community'],
    cons: ['Cross-browser quirks and layout testing on countless devices', 'High scrutiny on micro-interactions']
  },
  {
    id: 'car-backend-dev',
    title: 'Backend Systems Engineer',
    slug: 'backend-systems-engineer',
    category: 'Software',
    description: 'Designs reliable, scalable server architectures, microservices, and database layers that power modern applications.',
    overview: 'Backend Engineers solve difficult concurrency, data consistency, authentication, and throughput problems behind the scenes.',
    responsibilities: ['Architect microservices and event-driven backends', 'Optimize SQL queries and caching layers', 'Implement secure role-based access control and token auth', 'Scale systems to handle millions of requests per second'],
    education: "Bachelor's in Computer Science or Software Engineering",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+26% growth',
    salaryMin: 105000,
    salaryMax: 170000,
    skills: ['Go', 'Node.js/TypeScript', 'Java/C#', 'SQL & NoSQL', 'System Design', 'Caching', 'Message Queues'],
    tools: ['PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'RabbitMQ/Kafka', 'Grafana'],
    industries: ['Cloud Infrastructure', 'Financial Exchanges', 'Gaming', 'Enterprise Software'],
    pros: ['Focus on deep algorithmic and architectural problems', 'Direct ownership of system reliability and throughput', 'Excellent long-term engineering depth'],
    cons: ['Subtle race conditions and concurrency bugs can be hard to reproduce', 'High stakes when production outages occur']
  },
  {
    id: 'car-mobile-dev',
    title: 'Mobile Application Developer',
    slug: 'mobile-app-developer',
    category: 'Software',
    description: 'Builds native and cross-platform mobile apps for iOS and Android devices.',
    overview: 'Mobile Developers build smooth, battery-efficient applications that live in users pockets. You interface with device hardware, push notifications, and app store lifecycles.',
    responsibilities: ['Develop native (Swift/Kotlin) or cross-platform (React Native/Flutter) apps', 'Optimize battery consumption and local storage offline cache', 'Integrate push notifications and biometric authentication', 'Manage App Store and Google Play submissions'],
    education: "Bachelor's in CS or mobile software portfolio",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+21% growth',
    salaryMin: 95000,
    salaryMax: 155000,
    skills: ['React Native', 'Swift', 'Kotlin', 'Mobile UI Design', 'Offline Sync', 'REST APIs'],
    tools: ['Xcode', 'Android Studio', 'TestFlight', 'Fastlane', 'Firebase'],
    industries: ['Consumer Mobile', 'Health & Fitness', 'Banking Apps', 'Travel'],
    pros: ['Loved by millions of end users on their personal devices', 'Opportunity to leverage camera, AR, and biometric sensors', 'Strong freelance and product opportunities'],
    cons: ['App Store review delays and strict guidelines', 'Managing backwards compatibility with older OS releases']
  },

  // 3. Cybersecurity
  {
    id: 'car-sec-analyst',
    title: 'Cybersecurity Analyst (SOC)',
    slug: 'cybersecurity-analyst',
    category: 'Cybersecurity',
    description: 'Monitors, detects, and investigates cyber threats, unauthorized intrusions, and security alerts to protect corporate networks.',
    overview: 'Security Operations Center (SOC) analysts are the first line of defense. You inspect packet captures, analyze firewall logs, and respond rapidly to incident alerts.',
    responsibilities: ['Monitor SIEM dashboards for anomalous traffic and alerts', 'Triage security incidents and contain active compromises', 'Perform vulnerability assessments and credential audits', 'Document incident response reports and escalation paths'],
    education: "Bachelor's in Cybersecurity, Information Systems, or CompTIA Security+ / CySA+ certification",
    difficulty: 'Intermediate',
    demandLevel: 'Very High',
    futureGrowth: '+32% growth',
    salaryMin: 85000,
    salaryMax: 135000,
    skills: ['Network Protocols (TCP/IP)', 'Incident Response', 'Threat Intelligence', 'Log Analysis', 'Vulnerability Management'],
    tools: ['Splunk', 'Wireshark', 'CrowdStrike', 'Nessus', 'Snort'],
    industries: ['Defense & Aerospace', 'Banking', 'Government', 'Healthcare'],
    pros: ['Extremely high societal importance and job security', 'Exciting investigative detective-like problem solving', 'High upward mobility toward Security Engineer / CISO'],
    cons: ['Shift work and 24/7 monitoring schedules', 'Alert fatigue from false positives']
  },
  {
    id: 'car-penetration-tester',
    title: 'Penetration Tester (Ethical Hacker)',
    slug: 'penetration-tester-ethical-hacker',
    category: 'Cybersecurity',
    description: 'Legally attacks software, web applications, and networks to uncover security flaws before malicious adversaries do.',
    overview: 'Penetration testers simulate adversarial attacks against web apps, APIs, networks, and physical buildings to identify vulnerabilities and suggest hardening steps.',
    responsibilities: ['Perform black-box and white-box penetration tests on web apps & networks', 'Exploit vulnerabilities (SQLi, XSS, SSRF, Broken Access Control)', 'Reverse-engineer binaries and inspect codebases for zero-day flaws', 'Write detailed technical executive remediation reports'],
    education: "Degree in CS/Security or industry certifications (OSCP, CEH, PNPT)",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+30% growth',
    salaryMin: 100000,
    salaryMax: 165000,
    skills: ['Web Application Security (OWASP Top 10)', 'Network Exploitation', 'Python/Bash Scripting', 'Reverse Engineering', 'Cryptography'],
    tools: ['Burp Suite', 'Metasploit', 'Nmap', 'Kali Linux', 'Ghidra', 'Hashcat'],
    industries: ['Cybersecurity Consulting', 'Tech Giants', 'Banking & FinTech', 'Defense'],
    pros: ['Thrill of solving deep security puzzles ethically', 'High compensation and respected technical authority', 'Active bug bounty community and continuous discovery'],
    cons: ['Meticulous reporting requirements after tests', 'Strict legal boundaries and authorization protocols']
  },
  {
    id: 'car-cloud-sec-eng',
    title: 'Cloud Security Architect',
    slug: 'cloud-security-architect',
    category: 'Cybersecurity',
    description: 'Designs secure cloud topologies, IAM governance frameworks, and automated compliance guardrails.',
    overview: 'Cloud Security Architects enforce zero-trust network topologies, identity federation, and secrets isolation across multi-cloud environments.',
    responsibilities: ['Architect Zero-Trust cloud network segmentation', 'Design least-privilege IAM roles and service accounts', 'Implement automated Infrastructure as Code (IaC) security scanning', 'Audit cloud configurations against CIS benchmarks and SOC 2'],
    education: "Bachelor's in CS / Engineering or AWS/GCP Security Specialty",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+33% growth',
    salaryMin: 130000,
    salaryMax: 200000,
    skills: ['Cloud Architecture', 'Identity & Access Management (IAM)', 'Terraform', 'Kubernetes Security', 'Compliance Frameworks'],
    tools: ['AWS GuardDuty', 'HashiCorp Vault', 'Wiz', 'Prisma Cloud', 'Terraform'],
    industries: ['Enterprise Tech', 'Financial Institutions', 'Healthcare Systems'],
    pros: ['Top-tier executive and consulting salaries', 'Critical role in enterprise digital transformations', 'Broad impact across company infrastructure'],
    cons: ['High complexity balancing security rigor with developer velocity', 'Huge accountability in audit and breach scenarios']
  },

  // 4. Cloud & DevOps
  {
    id: 'car-devops-eng',
    title: 'DevOps & Site Reliability Engineer',
    slug: 'devops-site-reliability-engineer',
    category: 'Cloud',
    description: 'Automates deployment pipelines, ensures cloud infrastructure uptime, and manages containerized orchestration.',
    overview: 'DevOps and SRE specialists treat infrastructure as code. You eliminate operational toil, build CI/CD pipelines, and guarantee high availability of production clusters.',
    responsibilities: ['Build continuous integration & automated deployment pipelines', 'Orchestrate container clusters with Kubernetes', 'Define Infrastructure as Code using Terraform', 'Configure observability, alerting, and automated failover'],
    education: "Degree in Computer Science or extensive Linux/cloud administration experience",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+28% growth',
    salaryMin: 110000,
    salaryMax: 175000,
    skills: ['Linux Administration', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Terraform', 'Scripting (Bash/Python)', 'Monitoring'],
    tools: ['GitHub Actions', 'ArgoCD', 'Terraform', 'Prometheus', 'Datadog', 'Kubernetes'],
    industries: ['SaaS', 'E-commerce', 'FinTech', 'Cloud Providers'],
    pros: ['High leverage: improvements boost productivity for all company developers', 'Strong compensation and market demand', 'Work at the cutting edge of distributed infrastructure'],
    cons: ['On-call incident alerts during evenings or weekends', 'Context switching across diverse operational incidents']
  },
  {
    id: 'car-cloud-architect',
    title: 'Cloud Solutions Architect',
    slug: 'cloud-solutions-architect',
    category: 'Cloud',
    description: 'Designs resilient, scalable, cost-optimized cloud architectures for enterprise applications.',
    overview: 'Cloud Solutions Architects guide enterprise migration to cloud providers. You evaluate trade-offs between compute, storage, latency, and operational expense.',
    responsibilities: ['Evaluate enterprise workloads and design cloud migration roadmaps', 'Conduct Well-Architected reviews for scalability, security, and cost', 'Advise engineering teams on serverless vs container strategies', 'Optimize cloud spend and resource reservation schedules'],
    education: "Bachelor's in CS or extensive cloud certifications (AWS Solutions Architect Pro / GCP Fellow)",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+27% growth',
    salaryMin: 125000,
    salaryMax: 195000,
    skills: ['Cloud Architecture', 'Cost Optimization', 'Disaster Recovery', 'Networking & VPCs', 'Executive Communication'],
    tools: ['AWS Management Console', 'Google Cloud Platform', 'Azure Portal', 'Lucidchart/Draw.io', 'Infracost'],
    industries: ['Cloud Consulting', 'Global Enterprises', 'Financial Services'],
    pros: ['High compensation and consultative prestige', 'Strategic blend of technical architecture and business leadership', 'Diverse client and problem exposure'],
    cons: ['Heavy communication and presentation duties alongside technical design', 'Vendor lock-in nuances across cloud providers']
  },

  // 5. Engineering
  {
    id: 'car-robotics-eng',
    title: 'Robotics & Automation Engineer',
    slug: 'robotics-automation-engineer',
    category: 'Engineering',
    description: 'Designs, programs, and integrates autonomous mechanical systems, robotic arms, and sensory controls.',
    overview: 'Robotics Engineers work at the intersection of mechanical design, embedded programming, control systems, and computer vision.',
    responsibilities: ['Program kinematic and dynamic motion algorithms', 'Integrate LiDAR, cameras, and IMU sensor streams', 'Design and simulate robotic joints in CAD and ROS', 'Test robotic prototypes in physical laboratory and factory environments'],
    education: "Bachelor's or Master's in Robotics, Mechatronics, Electrical, or Mechanical Engineering",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+20% growth',
    salaryMin: 95000,
    salaryMax: 155000,
    skills: ['C++', 'Python', 'ROS/ROS2', 'Control Theory', 'Computer Vision', 'Embedded Electronics'],
    tools: ['Gazebo', 'SolidWorks', 'MATLAB/Simulink', 'OpenCV', 'Oscilloscopes'],
    industries: ['Automotive & Self-Driving', 'Warehouse Logistics', 'Medical Robotics', 'Aerospace'],
    pros: ['Working with physical hardware in the real world', 'Direct role in transforming manufacturing and medicine', 'Deep engineering prestige'],
    cons: ['Hardware testing cycles take significantly longer than pure software', 'Physical equipment expenses and lab constraints']
  },
  {
    id: 'car-embedded-eng',
    title: 'Embedded Systems & IoT Engineer',
    slug: 'embedded-systems-iot-engineer',
    category: 'Engineering',
    description: 'Writes low-level firmware for microcontrollers that power smart devices, automotive ECUs, and medical gear.',
    overview: 'Embedded Engineers program silicon chips with stringent memory and power constraints. You write real-time OS drivers and communicate over SPI, I2C, and CAN buses.',
    responsibilities: ['Write bare-metal C/C++ and RTOS firmware for ARM/RISC-V microcontrollers', 'Implement hardware communication protocols (SPI, I2C, UART, CAN)', 'Optimize firmware for ultra-low power consumption', 'Debug boards using logic analyzers and oscilloscopes'],
    education: "Bachelor's in Electrical Engineering, Computer Engineering, or CS",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+18% growth',
    salaryMin: 95000,
    salaryMax: 150000,
    skills: ['C', 'C++', 'Microcontrollers', 'RTOS', 'Digital Circuit Analysis', 'Hardware Protocols'],
    tools: ['STM32CubeIDE', 'Saleae Logic Analyzer', 'GDB', 'KiCad', 'J-Link'],
    industries: ['Smart Home IoT', 'Automotive', 'Medical Devices', 'Wearables'],
    pros: ['Writing code that controls physical electronics', 'Immunity from web framework churn: C and microcontroller physics are timeless', 'High demand for specialized hardware firmware talent'],
    cons: ['Hardware bugs cannot be hotfixed over the air easily', 'Need physical lab equipment for debugging']
  },

  // 6. Healthcare & Bio
  {
    id: 'car-health-informatics',
    title: 'Health Informatics Specialist',
    slug: 'health-informatics-specialist',
    category: 'Healthcare',
    description: 'Manages clinical electronic health record (EHR) systems, medical data standards, and hospital analytics pipelines.',
    overview: 'Health Informatics specialists bridge clinical medicine and computer science to enhance patient outcomes, reduce medical errors, and streamline hospital operations.',
    responsibilities: ['Maintain EHR data pipelines complying with HIPAA and HL7/FHIR standards', 'Analyze patient admission, readmission, and treatment efficacy datasets', 'Support clinical decision support system (CDSS) integrations', 'Train medical staff on clinical documentation workflows'],
    education: "Bachelor's or Master's in Health Informatics, Nursing Informatics, or Healthcare Admin",
    difficulty: 'Intermediate',
    demandLevel: 'Very High',
    futureGrowth: '+28% growth',
    salaryMin: 78000,
    salaryMax: 125000,
    skills: ['Healthcare Data Standards (HL7, FHIR)', 'SQL', 'HIPAA Compliance', 'Clinical Workflow', 'Data Analytics'],
    tools: ['Epic Systems', 'Cerner', 'Tableau', 'SQL Server', 'R'],
    industries: ['Hospital Networks', 'Health Insurance', 'Public Health Agencies', 'Digital Health Startups'],
    pros: ['Profound social impact saving and improving patient lives', 'Resilient, recession-proof industry', 'Collaborative clinical environment'],
    cons: ['Strict regulatory constraints and bureaucratic hospital processes', 'Legacy medical software interfaces']
  },
  {
    id: 'car-bioinformatics-analyst',
    title: 'Bioinformatics Scientist',
    slug: 'bioinformatics-scientist',
    category: 'Healthcare',
    description: 'Applies computational algorithms to analyze DNA sequences, protein structures, and genomic datasets.',
    overview: 'Bioinformaticians decode biological mysteries. You analyze next-generation sequencing (NGS) data, model cancer mutations, and accelerate drug discovery.',
    responsibilities: ['Process Next-Generation Sequencing (NGS) genomic datasets', 'Develop alignment algorithms and variant calling pipelines', 'Analyze RNA-seq expression profiles and molecular pathways', 'Collaborate with wet-lab geneticists and oncologists'],
    education: "Master's or Ph.D. in Bioinformatics, Computational Biology, or Molecular Genetics",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+22% growth',
    salaryMin: 98000,
    salaryMax: 160000,
    skills: ['Python', 'R', 'Genomics', 'High-Performance Computing (HPC)', 'Statistics', 'Biological Data Repositories'],
    tools: ['Bioconductor', 'BLAST', 'Nextflow', 'SAMtools', 'GATK'],
    industries: ['Biotech & Pharma', 'Genomics Labs', 'Cancer Research Centers', 'Agricultural Genetics'],
    pros: ['Pioneering personalized medicine and genetic therapies', 'Intellectually rich intersection of biology and computing', 'High academic and industry respect'],
    cons: ['Requires extensive academic preparation (often Ph.D.)', 'Massive file sizes and heavy compute queue times']
  },

  // 7. Finance & FinTech
  {
    id: 'car-quant-analyst',
    title: 'Quantitative Financial Analyst',
    slug: 'quantitative-financial-analyst',
    category: 'Finance',
    description: 'Designs mathematical models to price complex derivatives, assess market risk, and formulate algorithmic trading strategies.',
    overview: 'Quants operate at the nexus of stochastic calculus, numerical optimization, and high-frequency software execution.',
    responsibilities: ['Develop statistical arbitrage and algorithmic trading models', 'Calculate Value-at-Risk (VaR) and stress-test portfolio exposures', 'Backtest strategies against petabytes of historical tick market data', 'Optimize trading execution speed and slippage'],
    education: "Master's or Ph.D. in Financial Engineering, Mathematics, Physics, or CS",
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: '+19% growth',
    salaryMin: 140000,
    salaryMax: 275000,
    skills: ['C++', 'Python', 'Stochastic Calculus', 'Probability & Statistics', 'Financial Modeling', 'Algorithmic Execution'],
    tools: ['Bloomberg Terminal', 'Jupyter', 'KDB+/Q', 'NumPy/SciPy', 'C++ Boost'],
    industries: ['Hedge Funds', 'Proprietary Trading Firms', 'Investment Banks', 'Asset Management'],
    pros: ['Among the highest compensation packages in the global economy', 'Meritocratic culture driven by measurable PnL results', 'Deep mathematical rigor'],
    cons: ['High-stress environment tied to market volatility', 'Intense working hours in financial hubs']
  },
  {
    id: 'car-financial-analyst',
    title: 'Corporate Financial Analyst (FP&A)',
    slug: 'corporate-financial-analyst',
    category: 'Finance',
    description: 'Forecasts corporate revenue, evaluates investment opportunities, and builds financial valuation models.',
    overview: 'FP&A analysts advise corporate executives on capital expenditure, quarterly forecasts, unit economics, and merger & acquisition targets.',
    responsibilities: ['Build 3-statement financial models (Income, Balance Sheet, Cash Flow)', 'Perform variance analysis between budgeted and actual metrics', 'Evaluate ROI on capital projects and product launches', 'Prepare quarterly executive board decks and earnings models'],
    education: "Bachelor's in Finance, Economics, or Accounting (CFA charter track)",
    difficulty: 'Intermediate',
    demandLevel: 'Moderate',
    futureGrowth: '+12% growth',
    salaryMin: 72000,
    salaryMax: 115000,
    skills: ['Financial Modeling', 'Valuation (DCF, Comparables)', 'Excel Mastery', 'Accounting Principles', 'PowerPoint Presentation'],
    tools: ['Microsoft Excel', 'FactSet', 'PowerBI', 'Oracle NetSuite', 'Adaptive Insights'],
    industries: ['Tech Companies', 'Consumer Goods', 'Consulting Firms', 'Manufacturing'],
    pros: ['Essential role inside every medium to large corporation', 'Solid foundation for executive CFO or VP Finance paths', 'Broad business understanding'],
    cons: ['Heavy workload during month-end and quarterly financial closes', 'Significant time spent in spreadsheets']
  },

  // 8. Business & Product
  {
    id: 'car-product-manager',
    title: 'Technical Product Manager',
    slug: 'technical-product-manager',
    category: 'Business',
    description: 'Leads cross-functional teams of engineers, designers, and marketers to discover, validate, and ship digital products.',
    overview: 'Product Managers define the "why", "what", and "when" of software. You discover customer pain points, prioritize product backlogs, and drive roadmap execution.',
    responsibilities: ['Conduct user discovery interviews and synthesize customer needs', 'Define PRDs (Product Requirements Documents) and user stories', 'Prioritize sprint backlogs and collaborate closely with engineering leads', 'Track product analytics (retention, churn, conversion funnels)'],
    education: "Bachelor's in CS, Business, or engineering with proven project leadership",
    difficulty: 'Intermediate',
    demandLevel: 'Very High',
    futureGrowth: '+24% growth',
    salaryMin: 110000,
    salaryMax: 175000,
    skills: ['Product Strategy', 'User Discovery', 'Agile/Scrum', 'Data-Informed Decision Making', 'Cross-Functional Communication'],
    tools: ['Jira', 'Notion', 'Mixpanel/Amplitude', 'Figma', 'Linear'],
    industries: ['Tech Startups', 'E-commerce', 'Enterprise SaaS', 'Consumer Tech'],
    pros: ['High executive visibility and influence on the product vision', 'No boring days: constantly switching between design, data, and business', 'Direct path to founder or Chief Product Officer (CPO)'],
    cons: ['Responsibility without direct managerial authority over engineers', 'Blamed when products fail, while teams celebrate when they succeed']
  },
  {
    id: 'car-growth-marketer',
    title: 'Growth & Product Marketing Manager',
    slug: 'growth-product-marketing-manager',
    category: 'Business',
    description: 'Combines data analytics, behavioral psychology, and experimentation to acquire and retain software customers.',
    overview: 'Growth Marketers run rapid hypothesis-driven experiments across viral loops, paid channels, content funnels, and onboarding flows.',
    responsibilities: ['Run rapid A/B experiments across onboarding funnels and pricing pages', 'Manage paid search, social, and programmatic advertising campaigns', 'Formulate product positioning and value propositions', 'Analyze customer acquisition cost (CAC) and customer lifetime value (LTV)'],
    education: "Bachelor's in Marketing, Business, Communications, or Psychology",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+18% growth',
    salaryMin: 80000,
    salaryMax: 135000,
    skills: ['Growth Experimentation', 'Copywriting', 'Funnel Analytics', 'A/B Testing', 'Paid Advertising'],
    tools: ['Google Analytics 4', 'Meta Ads Manager', 'HubSpot', 'PostHog', 'Optimizely'],
    industries: ['SaaS', 'Direct-to-Consumer (DTC)', 'FinTech Apps', 'Gaming'],
    pros: ['Fast validation of creative ideas through measurable metrics', 'Tremendous value for early-stage startups seeking revenue', 'Dynamic blend of psychology and analytics'],
    cons: ['Constant pressure to hit weekly/monthly acquisition targets', 'Ad platform algorithm changes can disrupt funnels overnight']
  },

  // 9. Design & UX
  {
    id: 'car-product-designer',
    title: 'Product (UI/UX) Designer',
    slug: 'product-ui-ux-designer',
    category: 'Design',
    description: 'Crafts intuitive, visually polished digital experiences, design systems, and user flows across web and mobile products.',
    overview: 'Product Designers solve usability challenges. You conduct user research, create wireframes, test interactive prototypes, and design scalable UI systems.',
    responsibilities: ['Create interactive Figma wireframes and high-fidelity prototypes', 'Design and maintain scalable multi-brand design systems', 'Conduct moderated user usability tests and design critiques', 'Hand off specs and tokenized styling to frontend engineers'],
    education: "Bachelor's in Interaction Design, HCI, Graphic Design, or portfolio school",
    difficulty: 'Intermediate',
    demandLevel: 'High',
    futureGrowth: '+21% growth',
    salaryMin: 90000,
    salaryMax: 150000,
    skills: ['User Research', 'Wireframing & Prototyping', 'Design Systems', 'Typography & Visual Hierarchy', 'Micro-Interactions'],
    tools: ['Figma', 'Framer', 'FigJam', 'Maze', 'Adobe Creative Suite'],
    industries: ['Tech Software', 'Design Agencies', 'Media Companies', 'FinTech'],
    pros: ['Directly shape how software feels and operates', 'High creative autonomy and aesthetic satisfaction', 'Strong demand for designers who understand technical constraints'],
    cons: ['Subjective feedback from non-designer executives', 'Reconciling ideal user experience with tight engineering deadlines']
  },
  {
    id: 'car-ux-researcher',
    title: 'User Experience (UX) Researcher',
    slug: 'ux-researcher',
    category: 'Design',
    description: 'Conducts qualitative interviews, usability studies, and surveys to understand human motivations and software barriers.',
    overview: 'UX Researchers uncover hidden user needs through observational research, card sorting, and diary studies, ensuring products solve real human problems.',
    responsibilities: ['Formulate research plans and recruit target user demographics', 'Conduct 1-on-1 qualitative interviews and usability observations', 'Run quantitative surveys, SUS scoring, and tree testing', 'Deliver actionable user persona and journey map presentations'],
    education: "Degree in Human-Computer Interaction, Cognitive Science, Psychology, or Anthropology",
    difficulty: 'Intermediate',
    demandLevel: 'Moderate',
    futureGrowth: '+16% growth',
    salaryMin: 85000,
    salaryMax: 140000,
    skills: ['Qualitative Interviewing', 'Usability Testing', 'Survey Design', 'Synthesizing Findings', 'Empathy & Active Listening'],
    tools: ['UserTesting', 'Dovetail', 'Qualtrics', 'Miro', 'Lookback'],
    industries: ['Big Tech', 'Healthcare Apps', 'Consumer Hardware', 'Government Services'],
    pros: ['Deep psychological exploration of human behavior', 'Empowering design and engineering with authentic user voices', 'High focus on empathy and accessibility'],
    cons: ['Educating teams on why research matters ahead of immediate coding', 'Synthesizing hours of interview recordings under tight deadlines']
  },

  // 10. Media & Communications
  {
    id: 'car-tech-writer',
    title: 'Technical Writer & Documentation Specialist',
    slug: 'technical-writer-documentation',
    category: 'Media',
    description: 'Produces crystal-clear developer documentation, API references, tutorials, and architectural system guides.',
    overview: 'Technical Writers demystify complex software for external developers and internal teams. You test code examples, document REST/GraphQL APIs, and organize information architecture.',
    responsibilities: ['Write and maintain developer portal docs, SDK guides, and quickstarts', 'Test sample code and API endpoints for accuracy', 'Collaborate with engineers and product leads to document upcoming releases', 'Structure searchable, intuitive documentation knowledge bases'],
    education: "Degree in English, CS, Technical Communication, or software development background",
    difficulty: 'Intermediate',
    demandLevel: 'Moderate',
    futureGrowth: '+14% growth',
    salaryMin: 75000,
    salaryMax: 125000,
    skills: ['Technical Writing', 'API Documentation', 'Markdown/Docusaurus', 'Information Architecture', 'Basic Code Literacy'],
    tools: ['Markdown', 'Git', 'Swagger/OpenAPI', 'Postman', 'Notion'],
    industries: ['Developer Tooling (Stripe, Twilio)', 'Open Source Foundations', 'Cloud Providers'],
    pros: ['Critical contribution to developer adoption and customer satisfaction', 'Remote-friendly, deep focus work environment', 'Bridge between complex engineering and human comprehension'],
    cons: ['Keeping documentation updated amidst continuous software releases', 'Can be underappreciated until bad documentation causes customer churn']
  },

  // 11. Research & Science
  {
    id: 'car-ai-researcher',
    title: 'AI Research Scientist',
    slug: 'ai-research-scientist',
    category: 'Research',
    description: 'Invents new foundational algorithms, transformer architectures, and mathematical proofs for artificial intelligence.',
    overview: 'Research Scientists at major AI labs push the frontiers of what machines can learn. You publish peer-reviewed papers, explore reasoning models, and train frontier architectures.',
    responsibilities: ['Formulate foundational machine learning hypotheses', 'Derive novel mathematical proofs and loss formulations', 'Train multi-billion parameter foundation models across supercomputer clusters', 'Publish findings at top conferences (NeurIPS, ICML, CVPR)'],
    education: "Ph.D. in Computer Science, Machine Learning, Statistics, or Theoretical Physics",
    difficulty: 'Advanced',
    demandLevel: 'Very High',
    futureGrowth: '+36% growth',
    salaryMin: 160000,
    salaryMax: 350000,
    skills: ['Theoretical Machine Learning', 'Advanced Mathematics', 'PyTorch', 'Distributed GPU Training', 'Academic Publishing'],
    tools: ['Slurm Cluster', 'PyTorch', 'JAX', 'LaTeX', 'ArXiv'],
    industries: ['Frontier AI Labs', 'Big Tech Research (Google DeepMind, FAIR)', 'Academic Institutions'],
    pros: ['Shaping the future of human intelligence and machine autonomy', 'World-class compensation and compute resources', 'Immense intellectual freedom and prestige'],
    cons: ['Many research experiments fail or yield null results', 'Extremely competitive peer review and priority race']
  },

  // 12. Entrepreneurship & Strategy
  {
    id: 'car-tech-founder',
    title: 'Tech Startup Founder / Entrepreneur',
    slug: 'tech-startup-founder',
    category: 'Entrepreneurship',
    description: 'Identifies major market inefficiencies, raises venture capital, recruits world-class teams, and builds scalable enterprises.',
    overview: 'Founders build something out of nothing. You navigate market validation, product design, fundraising from angels and VCs, hiring, and company survival.',
    responsibilities: ['Formulate company vision and strategic milestones', 'Pitch angel investors and venture capital firms for seed and Series A funding', 'Recruit founding engineers and early team members', 'Talk to customers daily to iterate toward product-market fit'],
    education: 'No formal degree required; relentless problem-solving, resilience, and execution',
    difficulty: 'Advanced',
    demandLevel: 'High',
    futureGrowth: 'Evergreen',
    salaryMin: 50000,
    salaryMax: 250000,
    skills: ['Vision & Storytelling', 'Fundraising', 'Resilience', 'Hiring & Team Building', 'Rapid Prototyping', 'Financial Prudence'],
    tools: ['Pitch Decks', 'Linear', 'QuickBooks', 'Cap Table Management (Carta)', 'Slack'],
    industries: ['All Industries', 'B2B Software', 'Consumer Tech', 'DeepTech & Hardware'],
    pros: ['Unlimited financial and intellectual upside', 'Total autonomy to build your dream culture and product', 'Life-defining learning experience'],
    cons: ['Extremely high failure rate and financial risk', 'Relentless stress, sleepless nights, and responsibility for employees']
  },

  // 13. Emerging Careers
  {
    id: 'car-prompt-eng',
    title: 'AI Solutions & Prompt Engineer',
    slug: 'ai-solutions-prompt-engineer',
    category: 'Emerging Careers',
    description: 'Architects complex LLM orchestration pipelines, context-window optimizations, and agentic workflows.',
    overview: 'Prompt & AI Solutions Engineers optimize how modern foundation models interact with enterprise databases, tools, and human workflows.',
    responsibilities: ['Design robust multi-shot prompts and reasoning chains (CoT, ReAct)', 'Build Retrieval-Augmented Generation (RAG) vector pipelines', 'Benchmark model outputs for hallucination and safety', 'Integrate LLM API function calling with corporate tools'],
    education: "Bachelor's in CS, Linguistics, Cognitive Science, or hands-on AI portfolio",
    difficulty: 'Intermediate',
    demandLevel: 'Very High',
    futureGrowth: '+45% emerging growth',
    salaryMin: 95000,
    salaryMax: 160000,
    skills: ['Prompt Engineering', 'LangChain/LlamaIndex', 'Vector Databases', 'Python', 'System Evaluation'],
    tools: ['OpenAI/Gemini APIs', 'Pinecone/Chroma', 'LangSmith', 'Streamlit', 'Python'],
    industries: ['Enterprise Automation', 'Customer Support Tech', 'Legal Tech', 'Marketing Platforms'],
    pros: ['Front-row seat to the generative AI revolution', 'High market excitement and rapid project turnaround', 'Accessible entry point into advanced AI applications'],
    cons: ['Tooling and best practices evolve on a weekly basis', 'Risk of commoditization as foundation models improve zero-shot accuracy']
  },
  {
    id: 'car-blockchain-dev',
    title: 'Smart Contract & Web3 Engineer',
    slug: 'smart-contract-web3-engineer',
    category: 'Emerging Careers',
    description: 'Writes immutable smart contracts, decentralized finance protocols, and cryptographic verification systems.',
    overview: 'Smart Contract Engineers build financial and ownership protocols on decentralized blockchains. Code security is paramount because mistakes are irreversible.',
    responsibilities: ['Write and test smart contracts in Solidity or Rust', 'Audit contracts for reentrancy, integer overflow, and logic exploits', 'Develop decentralized web frontends (dApps) connecting to crypto wallets', 'Optimize gas consumption for transaction execution'],
    education: "Bachelor's in CS or demonstrated on-chain protocol development",
    difficulty: 'Advanced',
    demandLevel: 'Moderate',
    futureGrowth: '+18% growth',
    salaryMin: 110000,
    salaryMax: 185000,
    skills: ['Solidity', 'Rust', 'Cryptography', 'Smart Contract Auditing', 'EVM Architecture'],
    tools: ['Foundry/Hardhat', 'Ethers.js/Viem', 'Slither', 'Remix IDE', 'MetaMask'],
    industries: ['Decentralized Finance (DeFi)', 'Digital Identity', 'Supply Chain Provenance', 'Gaming'],
    pros: ['Pioneering trustless financial and computational primitives', 'High freelance and protocol token incentives', 'Deep focus on code correctness and security'],
    cons: ['Immutable code means bugs can lead to total loss of funds', 'Regulatory ambiguity across different countries']
  }
];
