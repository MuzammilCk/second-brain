---
source: github-api
project: "Masm_16-bit_8086"
language: "TypeScript"
updated: 2026-07-25
synced: 2026-08-24
url: "https://github.com/MuzammilCk/Masm_16-bit_8086"
---

# MASM Studio 🚀
### Industrial-Grade MASM 16-bit 8086 Cloud IDE

> **The Repl.it/CodeSandbox for Assembly Language**  
> Zero setup. Visual debugging. AI-powered. Built for education.

---

## 📊 The Problem

| Issue | Impact | Why It Matters |
|-------|--------|----------------|
| **No Native 16-bit Support** | Modern OS don't run 16-bit executables | Students can't test their code |
| **Complex Setup** | DOSBox + MASM + Configuration | 2-3 hours setup, high dropout rate |
| **No Modern IDE** | Using tools from the 1990s | Poor learning experience, no IntelliSense |
| **Platform Fragmentation** | Different setup for Windows/Mac/Linux | Instructors waste class time on setup |
| **No Collaboration** | Can't share code easily | Students work in isolation |
| **Limited Debugging** | Text-based debuggers, cryptic output | Hard to visualize register/memory changes |

### Market Opportunity
- 🎓 **10,000+** universities teach Computer Architecture
- 📚 **500,000+** students per year take assembly courses
- 💰 **$0** good modern tools (massive gap in market)
- 🌍 **Global problem** (not region-specific)

---

## 🎯 The Solution

**MASM Studio** is an AI-powered web-based IDE for 8086 assembly language programming with MASM syntax.

### What's Currently Working

✅ **Zero Setup** - Works in browser, no installation needed  
✅ **Modern Code Editor** - Monaco editor with syntax highlighting and IntelliSense  
✅ **AI-Powered Execution** - Gemini 2.5 Flash compiles and simulates 8086 code  
✅ **Step-by-Step Analysis** - See execution trace with register changes  
✅ **AI Assistant** - Chat with AI to explain code and fix errors  
✅ **Error Detection** - Clear error messages with fix suggestions  
✅ **Cross-Platform** - Works on any device with a modern browser  

### Planned Features

🔜 **Visual Debugging** - Interactive register/memory visualization panels  
🔜 **Code Sharing** - Share links to your programs  
🔜 **User Authentication** - Save and manage your projects  
🔜 **Collaborative Editing** - Real-time pair programming  
🔜 **Built-in Tutorials** - Interactive learning paths  
🔜 **Classroom Features** - Assignments and auto-grading for instructors  

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MASM Studio                            │
│  "Your Personal Assembly Language Teaching Assistant"       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │      AI Engine (Gemini 2.5 Flash)       │
        │  - Code Analysis & Execution             │
        │  - Interactive Debugging                 │
        │  - Educational Explanations              │
        └──────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐            ┌──────────────┐
        │   Frontend   │            │   Backend    │
        │  (React +    │◄──────────►│  (Node.js +  │
        │   Monaco)    │   WebSocket │   Express)   │
        └──────────────┘            └──────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │   Database   │
                                    │  (MongoDB)   │
                                    └──────────────┘
```

---

## 🤖 AI System Prompt

The heart of MASM Studio is its **industrial-grade AI system prompt** that powers the teaching assistant.

### Current AI Capabilities

✅ **COMPILER MODE** - Analyzes and validates assembly code syntax  
✅ **EXECUTOR MODE** - Simulates 8086 CPU execution step-by-step  
✅ **ASSISTANT MODE** - Answers questions and explains code  
✅ **FIX MODE** - Suggests fixes for compilation errors  

🔜 **DEBUGGER MODE** - Interactive debugging with breakpoints (planned)  
🔜 **TEACHER MODE** - Structured tutorials with examples (planned)  

### Implemented Features

- ✅ **Syntax Validation** - Error detection with clear messages
- ✅ **Step-by-Step Execution** - Trace of instructions with register changes
- ✅ **AI Explanations** - Chat interface for learning
- ✅ **Error Suggestions** - AI-powered fix recommendations
- ✅ **Modern Editor** - Monaco with assembly syntax highlighting
- ✅ **Collapsible Panels** - Flexible workspace layout

### Planned Features

- 🔜 **Visual Register/Memory Panels** - Real-time state visualization
- 🔜 **Interactive Debugger** - Breakpoints, watches, step execution
- 🔜 **Code Optimization** - Performance improvement suggestions
- 🔜 **System Prompt Templates** - Customizable AI behavior

---

## 🚀 Quick Start

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/asm-studio-pro.git
cd asm-studio-pro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Gemini API key to .env

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### For Educators

1. **Sign up** at https://asmstudio.dev
2. **Create a class** and get a class code
3. **Share the code** with your students
4. **Create assignments** with auto-grading test cases
5. **Monitor progress** with real-time analytics

### For Students

1. **Visit** https://asmstudio.dev
2. **Start coding** - no setup required!
3. **Run your code** and see visual execution
4. **Ask the AI** any questions about assembly
5. **Share your work** with classmates or instructors

---

## 📖 Usage Examples

### Example 1: Simple Addition Program

```asm
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    OPR1 DB 20H
    OPR2 DB 30H
    RES DW ?
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, OPR1
    ADD AL, OPR2
    MOV AH, 00H
    MOV RES, AX
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

**AI Output**: Step-by-step execution with register/memory visualization, educational explanations, and final result analysis.

### Example 2: Ask Questions

**You**: "Why do we need to set DS?"

**AI**: Provides detailed explanation with analogies, examples, and common mistakes.

### Example 3: Debug Errors

**Code with error**:
```asm
MOV AL, RES  ; RES is WORD, AL is BYTE
```

**AI**: Detects type mismatch, explains why it's wrong, provides 3 fix options.

---

## 🎨 Current Features

### ✅ What's Working Now

**Editor Experience:**
- ✍️ **Monaco Editor** - VS Code-like editing experience
- 🎨 **Syntax Highlighting** - Color-coded assembly instructions
- 💡 **IntelliSense** - Auto-completion for instructions and registers
- 📐 **Collapsible Panels** - Flexible workspace (editor, output, AI chat)

**Execution & Analysis:**
- 🤖 **AI-Powered Execution** - Gemini 2.5 Flash simulates 8086 CPU
- 📊 **Execution Trace** - Step-by-step instruction analysis
- 📋 **Symbol Table** - Variable and label tracking
- 🧮 **Register Tracking** - See register values after execution
- 🚨 **Error Detection** - Clear error messages with line numbers

**AI Assistant:**
- 💬 **Interactive Chat** - Ask questions about assembly language
- 🔍 **Code Explanation** - Get detailed explanations of your code
- 🛠️ **Fix Suggestions** - AI suggests fixes for compilation errors
- 📚 **Educational Responses** - Learn while you code

### 🔜 Planned Features

**Phase 1: Visual Enhancements**
- 🔜 Interactive register/memory visualization panels
- 🔜 Animated execution with highlighted instructions
- 🔜 Memory hex viewer with ASCII display

**Phase 2: User Features**
- 🔜 User authentication and project saving
- 🔜 Share links for code snippets
- 🔜 Built-in tutorials and examples

**Phase 3: Collaboration**
- 🔜 Real-time collaborative editing
- 🔜 Code review and commenting

**Phase 4: Education Platform**
- 🔜 Class management for instructors
- 🔜 Assignment creation and auto-grading
- 🔜 Student progress tracking

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Monaco Editor** - Code editor (VS Code engine)
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **Lucide Icons** - Icon library
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Redis** - Caching & sessions
- **WebSocket** - Real-time collaboration

### AI
- **Gemini 2.5 Flash** - AI engine
- **LangChain** - AI orchestration
- **Vector DB** - Semantic search for tutorials

### DevOps
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend hosting
- **AWS** - Backend hosting

---

## 📂 Project Structure

```
asm-studio-pro/
├── prompts/                    # AI System Prompts
│   ├── CORE_SYSTEM_PROMPT.md  # Main AI identity
│   ├── INTERFACE_TEMPLATES.md # Output formatting
│   └── EXAMPLES.md             # Interaction examples
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   └── styles/            # CSS/Tailwind
│   └── public/                # Static assets
│
├── backend/                    # Node.js Backend
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Business logic
│   │   ├── models/            # Database models
│   │   ├── services/          # External services
│   │   └── middleware/        # Express middleware
│   └── tests/                 # Backend tests
│
├── ai-engine/                  # AI Processing
│   ├── src/
│   │   ├── compiler/          # MASM compiler
│   │   ├── executor/          # 8086 simulator
│   │   ├── debugger/          # Debugging engine
│   │   └── ai/                # AI integration
│   └── tests/                 # AI engine tests
│
├── docs/                       # Documentation
│   ├── api/                   # API documentation
│   ├── tutorials/             # User tutorials
│   └── architecture/          # System architecture
│
├── docker/                     # Docker configs
├── k8s/                        # Kubernetes configs
└── scripts/                    # Build scripts
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend

# Run AI engine tests
npm run test:ai

# Run E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build all services
npm run build

# Deploy to production
npm run deploy:prod

# Or use Docker
docker-compose up -d
```

### Environment Variables

```env
# .env.example
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/asmstudio
REDIS_URL=redis://localhost:6379

# AI
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Auth
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Frontend
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: ESLint + Prettier
- **Commits**: Conventional Commits

---

## 📜 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MASM** - Microsoft Macro Assembler
- **DOSBox** - DOS emulator (inspiration for execution engine)
- **Monaco Editor** - VS Code editor engine
- **Gemini** - Google's AI model
- **shadcn/ui** - Beautiful UI components

---

## 📞 Contact

- **Website**: https://asmstudio.dev
- **Email**: support@asmstudio.dev
- **Twitter**: [@asmstudiopro](https://twitter.com/asmstudiopro)
- **Discord**: [Join our community](https://discord.gg/asmstudio)

---

## 🗺️ Roadmap

### Phase 1: MVP (Current - 60% Complete)
- [x] Core AI integration with Gemini 2.5 Flash
- [x] Basic compiler and executor via AI
- [x] Web interface with Monaco editor
- [x] Modern UI with collapsible panels
- [x] AI chat assistant
- [x] Error detection and fix suggestions
- [ ] System prompt templates
- [ ] User authentication
- [ ] Code sharing
- [ ] Visual register/memory panels

### Phase 2: Educational Features (Not Started)
- [ ] Built-in tutorials
- [ ] Interactive exercises
- [ ] Achievement system
- [ ] Progress tracking
- [ ] Example program library

### Phase 3: Collaboration (Not Started)
- [ ] User authentication system
- [ ] Project saving to database
- [ ] Real-time collaborative editing
- [ ] Code review tools
- [ ] Share links feature

### Phase 4: Classroom Features (Not Started)
- [ ] Instructor dashboard
- [ ] Class management
- [ ] Assignment creation
- [ ] Auto-grading system
- [ ] Student analytics

### Phase 5: Advanced Features (Future)
- [ ] Support for other assemblers (NASM, TASM)
- [ ] 32-bit and 64-bit modes
- [ ] Hardware simulation (VGA, keyboard, etc.)
- [ ] Mobile app (iOS/Android)

### Phase 6: Enterprise (Future)
- [ ] SSO integration
- [ ] LMS integration (Canvas, Moodle, Blackboard)
- [ ] Custom branding
- [ ] On-premise deployment
- [ ] REST API for integrations

---

## 📊 Status

![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/asm-studio-pro/ci.yml?branch=main)
![License](https://img.shields.io/github/license/yourusername/asm-studio-pro)
![Version](https://img.shields.io/github/package-json/v/yourusername/asm-studio-pro)
![Contributors](https://img.shields.io/github/contributors/yourusername/asm-studio-pro)

---

---

## 🎯 Project Status

**Current State:** Working prototype with core functionality  
**Active Development:** Yes  
**Contributions:** Welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)  
**License:** MIT  

**What Works:**
- ✅ Write and execute 8086 assembly code
- ✅ AI-powered compilation and simulation
- ✅ Interactive AI assistant for learning
- ✅ Modern web-based editor

**What's Missing:**
- ❌ User accounts and project saving
- ❌ Visual debugger panels
- ❌ Code sharing features
- ❌ Classroom/instructor tools

**Honest Assessment:** This is a functional MVP demonstrating AI-powered assembly execution. It's great for learning and experimentation, but not yet ready for production classroom use. Contributions and feedback welcome!

---

**Made with ❤️ for assembly language students worldwide**
