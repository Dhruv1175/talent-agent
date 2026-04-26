# 🤖 TalentScout AI: Autonomous Recruitment Agent

TalentScout AI is an intelligent recruitment agent designed to automate the initial stages of the hiring pipeline. Built for the **Deccan AI Catalyst Hackathon**, it moves beyond simple keyword matching by using LLM-driven reasoning to discover, score, and engage candidates autonomously.

## 🚀 Key Features

- **Precision Discovery Engine** – Analyzes Job Descriptions (JD) to extract core requirements and filters a talent pool based on strict technical alignment, preventing "False Positives" (e.g., matching Backend developers to Frontend roles).
- **Dual-Dimensional Scoring**:
  - *Technical Match Score* – A weighted calculation based on hard skills and domain expertise.
  - *Interest Score* – Derived from a simulated conversational outreach where the agent assesses candidate intent and fit.
- **Match Explainability** – Provides an "Agent Verdict" for every candidate, offering transparent reasoning for the assigned score.
- **Dynamic Candidate Ingestion** – Supports instant profile analysis via text-based resume ingestion.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI Orchestration**: Groq Cloud (Llama 3.3 / Mixtral models)
- **Styling**: Tailwind CSS & Framer Motion
- **Icons**: Lucide React
- **API**: Axios

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- A Groq API Key – [Get one at console.groq.com](https://console.groq.com)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/talent-agent.git
   cd talent-agent

2. **Install dependencies**

   ```bash
   npm install
   
3. **Set up environment variables** 
   - Create a .env file in the root directory and add your API key:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   
4. **Run the development server**

   ```bash
   npm run dev
   
5. **Open the app**

    -  Open http://localhost:3000 to see the agent in action.
  
#🤖 The Agentic Flow

**1. JD Analysis**: Paste a JD. The agent identifies mandatory vs. optional skills.
**2. Discovery**: The system scans the internal candidates.json and displays only those exceeding a 20% match threshold.
**3. Engagement**: Click "Assess Interest." The agent initiates a simulated conversation to gauge how well the candidate's career goals align with the role.
**4. Ranking**: The final dashboard displays a ranked shortlist based on the combined Match and Interest scores.
