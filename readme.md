# BMI Calculator — Full Stack (HTML/CSS/JS + Java Servlet)

## Project Structure
```
bmi-calculator/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/bmi/servlet/BMIServlet.java
        └── webapp/WEB-INF/web.xml
```

---

## Prerequisites
| Tool | Version |
|------|---------|
| JDK  | 11+     |
| Maven | 3.6+  |
| Apache Tomcat | 9 or 10 |

---

## Setup

### 1. Build the WAR
```bash
cd backend
mvn clean package
```

### 2. Deploy to Tomcat
```bash
cp target/bmi-calculator.war /path/to/tomcat/webapps/
```
Start Tomcat. API is live at:
```
http://localhost:8080/bmi-calculator/api/bmi
```

### 3. Open the Frontend
Open `frontend/index.html` directly in your browser. No build step needed.

---

## API

**POST** `/api/bmi`

| Param | Type | Example |
|-------|------|---------|
| weight | number (kg) | 70 |
| height | number (cm) | 175 |

**Response:**
```json
{
  "bmi": 22.9,
  "category": "Normal weight",
  "idealMin": 56.7,
  "idealMax": 76.3,
  "tip": "Great work! Maintain your weight with balanced meals and regular activity."
}
```

---

## Features
- BMI calculation (server-side in Java)
- Category + colour-coded result
- Animated BMI scale bar with pointer
- Ideal weight range for your height
- Personalised health tip
- Dark / Light theme toggle
- Responsive layout
- Enter key support
