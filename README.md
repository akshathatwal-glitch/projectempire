# 🌌 PROJECT: EMPIRE STATE OF MIND
### Imperial Security Bureau (ISB) & Order 66 Tactical Command Portal

> **CLEARANCE LEVEL: OMEGA**  
> *“The Empire no longer hunts blindly. We track, coordinate, and extinguish.”*

---

## 📜 Mission Briefing (The Scenario)

In a galaxy far, far away, the Galactic Empire has executed **Order 66**. Hundreds of pure-souled Jedi across the galaxy have been brutally hunted down by the Republic’s Grand Army. As they scatter and hide in remote corners of the galaxy, a new rebellion has emerged: **The HCET Syndicate** — a coalition of surviving Jedi coordinating covertly to hide, survive, and recruit new force-sensitives.

Since the HCET Syndicate devises innovative methods to deceive Imperial forces, **The Galactic Empire requires a galaxy-spanning Command, Intelligence, and Reconnaissance Portal**. 

**PROJECT EMPIRE STATE OF MIND** is that portal — a state-of-the-art Imperial command interface equipped for **global tracking, tactical planning, live comms, and active bounty management** to hunt down the last remaining Jedi and dismantle the HCET Syndicate once and for all.

---

## ✨ Key Features & Modules

### 1. 🎛️ Imperial Command Console (`/console`)
The primary tactical hub providing real-time operational oversight:
- **Galaxy-Wide Sector Activity Heatmap**: Visualizes Force-resonance activity and sighting counts across 7 galactic sectors.
- **Live Intercepts Stream**: Real-time decrypted transmission feed monitoring HCET Syndicate comms chatter with flagging controls and auto-scrolling terminal logs.
- **Active Hunts Registry**: Live telemetry tracking deployed Inquisitors and Imperial Hunters (e.g., Hunter Vex, Inquisitor Krath), their current engagement status, locations, and ETAs.
- **Directive Panel**: One-click operational controls to deploy hunters, execute sector lockdowns, or issue Imperial directives.

### 2. 🗂️ ISB Dossier Archive (`/dossiers`)
The Imperial Security Bureau's case-file archive for high-value targets:
- **3D Draggable File Board**: Interactive card board featuring physical drag-and-drop dynamics, mouse-parallax tilt, and custom scanline HUD aesthetics.
- **Target Tracking & Intelligence**: Detailed dossiers on targets such as **ASHVANE** (Syndicate Cell Leader), **WIDOW-9** (Courier Network), and **KAEL-7** (Syndicate Founder).
- **Comprehensive Dossier Modal**: Inspect full threat ratings (1–5), bounties, combat history, known associates, and intelligence briefs.
- **Filter & Search**: Instant filtering by status (*ACTIVE*, *CAPTURED*, *TERMINATED*, *UNCONFIRMED*) and threat level sorting.

### 3. 🛰️ Holonet Surveillance Radar (`/holonet`)
Deep-space orbital radar tracking force-resonance anomalies:
- **Concentric Sector Radar Grid**: Visual representation of galactic rings ranging from the Core Worlds to Wild Space and the Unknown Regions.
- **Interactive Scanning Engine**: Real-time terminal sweep animation that isolates new Force signatures and records live sightings directly into the Imperial database.
- **Contact Dossier Panel**: Detailed side-panel displaying threat status (*OMEGA*, *URGENT*, *STANDARD*), last reported GCT timestamp, and location notes.

### 4. 💰 Active Bounty Registry & Guild Board (`/bounties`)
Galaxy-wide bounty board for independent hunters and mercenary guilds:
- **Contract Management**: View active contracts with threat level indicators, last known sightings, and credit payouts.
- **Contract Claiming**: Instant contract claiming mechanism powered by `PATCH` API calls.
- **Post New Bounty Modal**: Imperial portal for authorizing new target designations, setting payout amounts, and selecting sector jurisdictions.
- **Hunter Commendations**: Honor roll showcasing top-performing Imperial bounty hunters and confirmed targets.

### 5. 📡 Imperial Broadcast Console (`/brodcasts`)
Galactic comms uplink console for issuing propaganda and operational mandates:
- **Sector-Wide Transmissions**: Draft and broadcast directives targeting specific sectors (Outer Rim, Core Worlds, etc.).
- **Clearance Priorities**: Assign transmission priorities (*STANDARD*, *URGENT*, *OMEGA*).
- **Cinematic Uplink Sequence**: Animated AES-512 encryption, relay node acquisition, and handshake confirmation before broadcast dispatch.
- **Preset Directive Templates**: Pre-loaded templates for Order 66 reminders, sector curfews, and bounty escalations.

### 6. 🔍 Command Palette (`Ctrl+K` / `Cmd+K`)
Global search palette accessible from anywhere in the application:
- Search dossiers, active targets, sector maps, and broadcast directives with instant route navigation.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Logic**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS HUD Glassmorphism
- **Animations & Physics**: 
  - [Motion (Framer Motion v13)](https://motion.dev/) — Micro-interactions, page transitions, and modal physics
  - [GSAP & @gsap/react](https://gsap.com/) — 3D word reveals, ambient floating animations, and scroll triggers
- **3D & Canvas**: Three.js (Ambient canvas particle engine)
- **Iconography**: Lucide React
- **Backend**: Next.js App Router Route Handlers (`app/api/...`)
- **Database**: Module-level in-memory singleton store (`lib/db.ts`)

---

## 📡 REST API Architecture

The application includes a built-in backend API running on Next.js Route Handlers:

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bounties` | Fetch bounties with query filters (`?sector=`, `?status=`, `?sort=`, `?q=`) |
| `POST` | `/api/bounties` | Submit a new bounty target |
| `GET` | `/api/bounties/[id]` | Fetch single bounty details |
| `PATCH` | `/api/bounties/[id]` | Claim/update bounty contract status |
| `GET` | `/api/broadcasts` | Fetch broadcast transmission log |
| `POST` | `/api/broadcasts` | Transmit a new broadcast directive |
| `GET` | `/api/dossiers` | List ISB target dossiers with search & status filters |
| `GET` | `/api/dossiers/[id]` | Fetch single dossier details by ISB ID |
| `GET` | `/api/sightings` | Fetch Holonet radar force-resonance sightings |
| `POST` | `/api/sightings` | Record a new radar sighting |
| `GET` | `/api/intel` | Poll live decrypted intercept feed lines |
| `GET` | `/api/hunters` | Fetch active hunter and Inquisitor deployment telemetry |
| `GET` | `/api/sectors` | Fetch galaxy sector activity levels and sighting metrics |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed on your system.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Development Server
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to access the portal.

### 4. Build & Verification
To run TypeScript type checks and ESLint verification:
```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Production Build
npm run build
```

---

## 🛡️ License & Credits

Designed and built for the Order 66 Hackathon. Imperial Security Bureau asset logos and lore are property of Lucasfilm Ltd.
