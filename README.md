# Kisan-AGI 🌾🤖
> **The Autonomous Agricultural Doctor**

Kisan-AGI is an advanced AI-powered platform designed to empower farmers with instant crop disease diagnosis, personalized recovery plans, and connections to local verified dealers. By leveraging **Google Vertex AI (Gemini 1.5 Pro)** and **Geolocation Services**, it acts as a 24/7 digital agronomist.

---

## 🚀 Key Features

### 1. **AI-Powered Diagnosis** 🍃
-   **Instant Analysis:** Upload a photo of a crop leaf, and our AI agent (Gemini 1.5 Pro) identifies diseases with high accuracy.
-   **Severity Detection:** Classifies issues as Low, Medium, or High severity.
-   **Confidence Score:** Provides a transparency score for the diagnosis.

### 2. **Actionable Recovery Plans** 📅
-   **Day-by-Day Schedule:** Generates a structured 3-step treatment timeline (e.g., Immediate Action, Follow-up, Prevention).
-   **Specific Prescriptions:** Recommends exact chemical or organic treatments (e.g., "Spray Copper Oxychloride").

### 3. **Smart Dealer Locator** 📍
-   **Hyper-Local Search:** Automatically detects the user's location to find nearby agricultural dealers.
-   **Stock Verification:** Filters dealers based on the *specific* medicine required for the diagnosed disease.
-   **Google Maps Integration:** Visualizes dealers on an interactive map with distance and contact info.

### 4. **User-Centric Interface** 🎨
-   **Multilingual Support:** Toggle between **English**, **Hindi**, and **Marathi** (UI synced globally).
-   **Cyber-Agri Aesthetic:** A modern, glassmorphism-inspired dark mode design.
-   **Smooth Experience:** Optimized performance with smooth scrolling and intuitive navigation.

---

## 🛠️ Tech Stack

-   **Frontend:** React (Vite), TailwindCSS, Framer Motion, Lucide Icons.
-   **Backend:** Node.js, Express.js.
-   **Database:** MongoDB (Geo-spatial queries for dealer search).
-   **AI Engine:** Google Vertex AI (Gemini 1.5 Pro).
-   **External APIs:** Google Maps Platform (Places API).

---

## ⚙️ Installation & Setup

### 1. Prerequisites
-   Node.js (v18+)
-   MongoDB Atlas URI
-   Google Cloud Service Account (JSON) for Vertex AI
-   Google Maps API Key

### 2. Clone & Install
```bash
git clone https://github.com/Krishna-cell-12/Kisan-AGI.git
cd Kisan-AGI

# Install Root Dependencies (Backend)
npm install

# Install Frontend Dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the **root** directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
PROJECT_ID=your_google_cloud_project_id
GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Google Cloud Authentication

**For Local Development:**  
Place your `service-account.json` in the root directory.

**For Production (Vercel):**  
Set the `SERVICE_ACCOUNT_JSON` environment variable in the Vercel Dashboard (Settings > Environment Variables).  
The value should be the entire contents of your `service-account.json` file as a single-line JSON string.

---

## ▶️ Running the Application

We have streamlined the workflow to run both Frontend and Backend with a **single command**:

```bash
# Runs Backend (Port 5000) and Frontend (Port 8080) concurrently
npm run dev
```

-   **Frontend:** [http://localhost:8080](http://localhost:8080)
-   **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 🧪 API Verification & Testing (Postman)

You can verify the backend logic independently using **Postman** or **cURL**.

### 1. Diagnose Endpoint
*   **URL:** `POST http://localhost:5000/api/diagnose`
*   **Body:** `form-data`
    *   Key: `leaf_image`
    *   Value: [Upload a file]
*   **Response:** Returns JSON with `disease_name`, `confidence_score`, `timeline`, and `recommended_product`.

### 2. Dealers Endpoint
*   **URL:** `GET http://localhost:5000/api/dealers`
*   **Query Params:**
    *   `lat`: 19.0760
    *   `long`: 72.8777
    *   `product`: Fungicide
*   **Response:** Returns a list of dealers sorted by distance, with stock status.

---

## 🔄 Recent Updates
-   **Full Integration:** Frontend is now fully wired to the Backend API.
-   **Concurrent Execution:** `npm run dev` now launches the full stack.
-   **UI Polish:** Added smooth scrolling, removed redundant profile sections, and fixed navigation 404s.
-   **Real-time Sync:** Language settings and Scan History are now globally synchronized.

---

**Built with 💚 for Indian Farmers.**
