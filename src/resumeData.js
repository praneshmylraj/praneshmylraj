/**
 * Pranesh Mylraj - Complete Portfolio & Career Story
 */

const RESUME_DATA = {
    personal: {
        name: "Pranesh Mylraj",
        title: "Senior Software Engineer @ Amazon Lab126",
        tagline: "Distributed Systems • Platform & DevEx Engineering • OS & Edge Platforms • Agentic AI Architecture • Test Architecture",
        location: "Irvine, California, United States",
        phone: "206-353-9731",
        email: "inboxpranesh@gmail.com",
        linkedin: "https://www.linkedin.com/in/praneshmylraj",
        github: "https://github.com/praneshmylraj",
        languages: ["English (Native or Bilingual)", "Tamil (Native or Bilingual)", "French (Elementary)"],
        topSkills: ["Technology Roadmapping", "Project Planning", "Peer Mentoring"],
        certifications: [
            "Business English Vantage",
            "AMCAT Certified Business Analyst",
            "AMCAT Certified Software Engineer - Product"
        ]
    },

    summary: `Senior Software Engineer with ~9 years of experience at Amazon Lab126. Specializing in distributed systems, backend services, and robust platform infrastructure for Linux-based edge devices that ship to tens of millions of customers (including Fire TV and Echo Show). Passionate about high-throughput, highly available services and proving resilience through chaos engineering, agentic AI frameworks, and edge platform architecture.`,

    milestones: [
        {
            id: "contact",
            label: "01 // Profile & Contact",
            badge: "OVERVIEW",
            title: "Pranesh Mylraj — Senior Software Engineer",
            subtitle: "Amazon Lab126 • Irvine, California",
            location: "Irvine, CA",
            period: "9+ Years at Amazon",
            quote: "Designing high-throughput, highly available distributed systems and proving resilience through chaos engineering and agentic AI.",
            highlights: [
                "📍 Location: Irvine, California, United States",
                "📞 Mobile: (206) 353-9731",
                "✉️ Email: inboxpranesh@gmail.com",
                "🔗 LinkedIn: linkedin.com/in/praneshmylraj",
                "💻 GitHub: github.com/praneshmylraj",
                "🗣️ Languages: English, Tamil, French",
                "🏆 Top Skills: Technology Roadmapping, Project Planning, Peer Mentoring"
            ],
            techTags: ["Distributed Systems", "Platform & DevEx", "Linux Edge", "Agentic AI", "AWS"]
        },
        {
            id: "senior-swe",
            label: "02 // Senior Software Engineer",
            badge: "AMAZON LAB126",
            title: "Senior Software Engineer — Amazon Lab126",
            subtitle: "October 2023 – Present • Irvine, CA",
            location: "Irvine, CA",
            period: "Oct 2023 – Present (3 yrs 1 mo)",
            quote: "Building the on-device validation stack for Amazon's new Linux-based OS (VegaOS) and scaling backend systems past 10K+ TPS.",
            highlights: [
                "✨ VegaOS Greenfield OS Stack: Built and own the full on-device validation stack for VegaOS (Amazon's new Linux OS) from scratch: device driver, on-device systemd daemon, and internal framework. The single validation path for Fire TV and Echo Show running ~100K runs/day across thousands of devices in customers' hands.",
                "⚡ 10K+ TPS High-Throughput Service: Scaled Fire TV DVR scheduling backend past 10K+ TPS. Built multi-host load-testing engine on real OAuth/Protobuf hot paths, integrated fault injection & chaos engineering, and tuned infra to cut cloud spend by ~60% to gate the launch go/no-go decision.",
                "🤖 Agentic AI on Amazon Bedrock: Spearheaded multi-agent orchestration and reusable MCP servers for ~250 engineers org-wide, plus an ML crash-triage system (foundation models + RAG) achieving 75% real-time classification accuracy to slash on-call load.",
                "📊 Customer-Signal Analytics Engine: Architected a data-aggregation layer ingesting developer Q&A, Amazon reviews, beta programs, and telemetry reconciled over MCP for recurring VP-level leadership reviews."
            ],
            techTags: ["VegaOS", "Linux Systemd", "10K+ TPS", "OAuth / Protobuf", "Chaos Engineering", "Bedrock", "MCP Servers", "RAG"]
        },
        {
            id: "swe-2",
            label: "03 // Software Engineer II",
            badge: "AMAZON LAB126",
            title: "Software Engineer II — Amazon Lab126",
            subtitle: "December 2019 – October 2023 • Irvine, CA",
            location: "Irvine, CA",
            period: "Dec 2019 – Oct 2023 (3 yrs 11 mos)",
            quote: "Architecting developer platforms comparable to Android CTS and lifecycle microservices for 100K+ devices.",
            highlights: [
                "🛠️ Type-Based OS DevTools Framework: Designed unified platform-specific abstractions (Appium, custom Maestro for VegaOS, UIAutomator for FireOS) behind one CLI for engineers & AI agents; adopted across 20 component teams running 15K tests/day (comparable to Android's CTS).",
                "🌐 Distributed Device-Lifecycle Service: Owned end-to-end REST service managing 100K+ devices across 100+ tenants (factory provisioning to field operation), normalizing 4 inconsistent upstream systems into 1 trustworthy view (DynamoDB, LDAP, CSRF, SSO, CloudWatch); built TV client caching partner details with Wi-Fi push refresh.",
                "🎯 Edge Native UI Validation: Engineered validation system for native Linux UI components under tight edge-compute limits using runtime-generated IDL bindings and OpenCV image-diff; 1,000+ combinations across 6 teams, lifting QA velocity 40%."
            ],
            techTags: ["DevTools CLI", "REST Microservices", "DynamoDB", "IDL Bindings", "OpenCV", "FireOS / VegaOS", "Appium"]
        },
        {
            id: "swe-1",
            label: "04 // Software Engineer I & Intern",
            badge: "AMAZON",
            title: "Software Engineer I & Intern — Amazon",
            subtitle: "September 2017 – November 2019 • Greater Chennai Area",
            location: "Chennai, India",
            period: "2 yrs 3 mos",
            quote: "Pioneering DEX bytecode profiling for 10M+ devices and building low-latency remote streaming tools.",
            highlights: [
                "🔬 DEX Bytecode & ASan Profiling: DEX bytecode instrumentation (dexlib2 with modified Dx) injecting coverage probes across 8+ Fire TV system apps on 10M+ devices, plus on-device AddressSanitizer (ASan) tooling; surfaced 15+ launch blockers in OS & services.",
                "📺 Low-Latency Remote Device Streaming: Shipped web-based remote-control and streaming tool (scrcpy with WebSocket, ADB relay, SSO) letting engineers access lab devices across countries without shipping hardware; served 200+ daily users, cutting remote debugging time by ~70%.",
                "🛒 Appstore UI Automation: Owned automation suites across multiple frameworks for retail web (100M+ shoppers) and on-device apps using Page Object Model and reference-string abstractions resilient to redesigns."
            ],
            techTags: ["DEX Bytecode (dexlib2)", "AddressSanitizer (ASan)", "WebSocket", "scrcpy / ADB", "Page Object Model", "Appstore"]
        },
        {
            id: "arsenal",
            label: "05 // Technical Arsenal",
            badge: "CORE COMPETENCIES",
            title: "Technical Arsenal & Core Architecture",
            subtitle: "Full-Stack Distributed Systems & AI Systems",
            location: "Cloud & Edge",
            period: "End-to-End Stack",
            quote: "From bare metal Linux drivers and microservices to multi-agent LLM orchestration.",
            highlights: [
                "⚡ Core Paradigms: Distributed Systems, Scalability, High Availability, Microservices, API Design, Performance Engineering, Chaos Engineering, DevOps, Edge Computing.",
                "☁️ Cloud & Infrastructure: AWS (ECS, Fargate, Lambda, API Gateway, DynamoDB, S3, SQS, CDK), Docker, Jenkins, Serverless, Infrastructure as Code (IaC).",
                "🤖 AI & ML: Agentic AI, Multi-Agent Systems, Amazon Bedrock, AgentCore, Model Context Protocol (MCP), LLMs, RAG, Foundation Models.",
                "💻 Languages & Protocols: Java, Python, TypeScript, C++, REST, OAuth, Protobuf, WebSockets."
            ],
            techTags: ["AWS (ECS/CDK)", "Bedrock / MCP", "Java / TypeScript / Python", "C++ / Linux", "Protobuf / OAuth", "Docker / IaC"]
        },
        {
            id: "education",
            label: "06 // Education & Foundations",
            badge: "BACKGROUND",
            title: "Education & Early Roots",
            subtitle: "Engineering Degree & Computer Science",
            location: "Tamil Nadu, India",
            period: "2007 – 2018",
            quote: "Grounded in Information Technology and computer science principles.",
            highlights: [
                "🎓 Sri Krishna College of Engineering & Technology: Bachelor's Degree, Information Technology (2014 – 2018)",
                "🏫 St. Jude's Public School & Junior College, Kotagiri (Nilgiris): Science & Computer (2007 – 2014)",
                "📜 Certifications: Business English Vantage, AMCAT Certified Business Analyst, AMCAT Certified Software Engineer - Product"
            ],
            techTags: ["B.Tech Information Technology", "Algorithms & Data Structures", "Software Engineering", "Kotagiri"]
        },
        {
            id: "connect",
            label: "07 // Let's Connect",
            badge: "UPLINK",
            title: "Let's Build the Future Together",
            subtitle: "Direct Contact Channels",
            location: "Irvine, CA & Remote",
            period: "Always Open for Exciting Ideas",
            quote: "Passionate about distributed platforms, edge operating systems, and agentic AI architectures.",
            highlights: [
                "✉️ Email: inboxpranesh@gmail.com",
                "📞 Phone: (206) 353-9731",
                "💼 LinkedIn: linkedin.com/in/praneshmylraj",
                "🐙 GitHub: github.com/praneshmylraj"
            ],
            techTags: ["Hire", "Collaborate", "Advisor", "Chat Systems"]
        }
    ]
};

window.RESUME_DATA = RESUME_DATA;
