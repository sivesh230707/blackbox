# Blackbox AI Hardware — Backend API Service

A lightweight, robust Node.js & Express REST API server powering the **Blackbox Student Study Workspace Dashboard**.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm start
```
By default, the server listens on **`http://localhost:5000`**.

---

## 📡 API Endpoints

### Health & Telemetry
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/telemetry` | Edge Node 04 ingest status & Privacy Mode status |

### Lectures & Transcripts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lectures` | List all course lectures |
| `GET` | `/api/lectures/active` | Get currently active lecture |
| `GET` | `/api/lectures/:id/topics` | Get acoustic timeline scrub topic clusters |
| `GET` | `/api/lectures/:id/transcript` | Get dual-speaker diarized transcript entries |

### Structured Notes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes/:id/summary` | Executive smart summary and key takeaways |
| `GET` | `/api/notes/:id/concepts` | Categorized taxonomy and key concepts |

### Formulas & Math Solver
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/formulas` | List extracted formula cards with LaTeX |
| `POST` | `/api/formulas/calculate-fmax` | Calculate $f_{max}$ given $t_{cq}$, $t_{comb}$, $t_{setup}$ |

### Quizzes & Flashcards
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quizzes` | Practice quiz questions |
| `POST` | `/api/quizzes/verify` | Verify answer and get lecture grounding drawer data |
| `GET` | `/api/quizzes/flashcards` | Flashcards with SM-2 repetition status |
| `POST` | `/api/quizzes/flashcards/:id/review` | Update card recall mastery (`hard`, `good`, `easy`) |

### AI Study Assistant
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Query local RAG AI with citations & sources |

---

## 🧪 Example API Calls

### Calculate Maximum Clock Frequency
```bash
curl -X POST http://localhost:5000/api/formulas/calculate-fmax \
  -H "Content-Type: application/json" \
  -d '{"tcq": 1.2, "tcomb": 4.5, "tsetup": 1.8}'
```

### Ask AI Assistant
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "Explain Mealy vs Moore outputs"}'
```
