# AI-Based Smart Complaint Management System 🛡️🤖

Welcome to the **AI-Based Smart Complaint Management System**, a high-fidelity, premium MERN stack application designed to automate, streamline, and analyze civic complaints. Using advanced LLMs and robust heuristic engines, the system automatically detects complaint urgency, suggests the concerned municipal department, provides high-quality summaries, and drafts automated response messages instantly upon ticket submission.

---

## 🌟 Key Features

### 1. Interactive Command Dashboard
- **Real-Time Analytics Counters**: Displays total registered complaints alongside breakdowns of pending, in-progress, and resolved items.
- **Dynamic Category Load Chart**: Visualizes complaint volume across different civic departments (Water Supply, Electricity, Sanitation, etc.) using interactive **Recharts** bar graphs.
- **Recent Alerts Activity Tracker**: Highlights the most recently reported issues with urgency indicators and quick status updates.

### 2. Glassmorphic Complaint Registration
- **Dynamic Input Panel**: Premium, sleek interface for reporting civic issues with name, email, title, category, location, and description.
- **Instant AI Analysis display**: Upon successful submission, a beautiful side-by-side card displays real-time AI parameters:
  - **Urgency priority**: (High, Medium, Low)
  - **Concerned Department Recommendation**: (e.g. Water department suggestion, Sanitation department)
  - **AI-generated summary**: A concise summary of the issue description
  - **Auto-responder message**: An automated responder mail response addressing the complainant and acknowledging next steps.

### 3. Smart Tickets Manager
- **Category Filter Tabs**: Swiftly browse and filter complaints dynamically.
- **Search by Location**: Uses a dedicated location-search endpoint `/api/complaints/search?location=...` to query issues in specific areas.
- **Ticket Lifecycle Control**: Directly upgrade complaint status (`Pending` ➔ `In Progress` ➔ `Resolved`) from inline dropdown selectors.
- **Details Drawer**: Expandable card panels displaying the full complaint details and comprehensive AI Insights.
- **Remove Capability**: Quickly clean up resolved and duplicate reports.

### 4. Enterprise-Grade Security & Authentication
- **Secure Password Hashing**: Utilizes **bcryptjs** for robust password encryption on storage.
- **JWT Authorization**: Protects system state changes and administration screens.
- **Autologout Sessions**: Front-end interceptors that monitor auth integrity and safely direct users to login.

---

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js**: Lightweight, modular API backend server.
- **MongoDB** & **Mongoose**: NoSQL database for flexible data schemas with strict validator rules.
- **OpenRouter AI / Axio completions**: Seamless connection to OpenRouter (GPT-4o-mini) for deep analytical processing, with a highly-resilient, rule-based local fallback parser.
- **jsonwebtoken** & **bcryptjs**: Clean JWT-token issue and encryption.

### Frontend
- **Vite** & **React**: Rapid reactive compilation.
- **Lucide Icons**: Rich, consistent SVG iconography.
- **Recharts**: Responsive charting widgets.
- **Vanilla CSS Tokens**: Premium dark glassmorphism system with smooth transitions.

---

## ⚙️ Backend RESTful API Endpoints

### 1. Authentication
* **POST** `/api/auth/signup` - Register a new account
* **POST** `/api/auth/login` - Authenticate user and issue JWT token

### 2. Complaint API
* **POST** `/api/complaints` - Register a new complaint (triggers automated AI analysis)
* **GET** `/api/complaints` - Retrieve all complaints (supports category filters)
* **GET** `/api/complaints/search?location=<location>` - Search complaints by exact/partial location
* **PUT** `/api/complaints/:id` - Update ticket status (`Pending`, `In Progress`, `Resolved`)
* **DELETE** `/api/complaints/:id` - Delete a complaint

### 3. AI Analysis Direct API
* **POST** `/api/ai/analyze` - Directly query AI details for title, description, category, and location without persisting database entries.

---

## 🚀 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally or an active MongoDB Atlas cluster.

### Setup Instructions

1. **Clone & Extract the Workspace**:
   Navigate into the project's root folder.

2. **Configure Environment Variables**:
   * **Backend**: Create a `.env` file inside the `backend` folder:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/complaint-db
     JWT_SECRET=your_jwt_secret_key_here
     OPENROUTER_API_KEY=your_openrouter_api_key_here # Optional fallback
     ```
   * **Frontend**: Verify `.env` file in the `frontend` folder:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```

3. **Install Dependencies & Start the Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Install Dependencies & Start the Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the application.
