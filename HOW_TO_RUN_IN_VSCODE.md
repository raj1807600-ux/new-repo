# VS Code Me Run Karne Ka Simple Guide (Step-by-Step)

## Method 1: Sabse Simple Tareeka (1-Click Run)

1. **VS Code** me ye folder open karein: `C:\Users\91854\srs`
2. File explorer me `run_all.bat` file par double click karein ya terminal me run karein:
   ```cmd
   .\run_all.bat
   ```
3. Ye automatically dono servers (Backend + Frontend) alag-alag windows me start kar dega.
4. Apne browser me open karein: **[http://localhost:5173/](http://localhost:5173/)**

---

## Method 2: VS Code ke Terminal se Run Karna (Recommended)

VS Code me aapko **2 Terminals** open karne hain:

### Terminal 1: Backend Server (Python Flask)

1. VS Code me Terminal open karein (**Ctrl + `** ya `Terminal -> New Terminal`)
2. Ye command run karein:
   ```powershell
   python backend/run.py
   ```
   *(Aapko output dikhega: `Running on http://127.0.0.1:5000`)*

---

### Terminal 2: Frontend App (React + Vite)

1. Terminal ke right side me **`+` (New Terminal)** icon par click karein.
2. Ye command run karein:
   ```powershell
   $env:Path = "C:\Users\91854\srs\tools\nodejs;" + $env:Path
   cd frontend
   npm run dev
   ```
   *(Aapko output dikhega: `Local: http://localhost:5173/`)*

---

## Method 3: VS Code Tasks Se Run Karna

1. VS Code me **`Ctrl + Shift + P`** press karein.
2. Type karein: `Tasks: Run Task`
3. Select karein:
   - **`1. Run Backend Server (Flask)`**
   - Phir se wahi karke select karein: **`2. Run Frontend Server (React)`**

---

## Login Demo Credentials

Browser me `http://localhost:5173/` kholne ke baad:

- **Student Login**:
  - Email: `student@oriental.ac.in`
  - Password: `Student@123`

- **TPO Admin Login**:
  - Email: `admin@oriental.ac.in`
  - Password: `Admin@123`

*(Login page par direct **1-Click Demo Buttons** bhi diye gaye hain)*
