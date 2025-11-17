# ☕ Alberta Productivity Caffeine Optimizer

<div align="center">

![Alberta Flag](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Flag_of_Alberta.svg/120px-Flag_of_Alberta.svg.png)

**Optimize your caffeine intake for peak productivity in Alberta, Canada!**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Powered by AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-7C3AED?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 🎯 Overview

The **Alberta Productivity Caffeine Optimizer** is a smart web application designed to solve Alberta's productivity crisis through personalized caffeine management. Built for a hackathon, this app uses AI to create custom caffeine intake schedules based on your unique body composition, health metrics, and lifestyle.

### 🌟 Key Features

- 🗺️ **Location-Based Access** - Exclusive to Alberta residents (with a fun workaround!)
- 🧮 **Smart Calculations** - Personalized caffeine limits based on:
  - Body weight and height
  - Blood pressure and heart rate
  - Age and gender
  - Activity level
  - Caffeine tolerance
- 🤖 **AI-Powered Scheduling** - Claude AI generates optimal intake times throughout your day
- ☕ **Multiple Options** - Get recommendations for coffee, energy drinks, or caffeine pills
- 📏 **Dual Units** - Toggle between Imperial (lb/in) and Metric (kg/cm) systems
- 🍺 **Fun Bonus** - Calculate beer limits before productivity drops (educational purposes!)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A sense of humor about Alberta! 🏔️

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/alberta-caffeine-optimizer.git
   cd alberta-caffeine-optimizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React** | Frontend framework |
| **Tailwind CSS** | Styling and responsive design |
| **Claude AI API** | AI-powered scheduling |
| **Lucide React** | Beautiful icons |
| **IP Geolocation APIs** | Location detection |

---

## 📱 Features in Detail

### 1. Location Detection
The app automatically detects if you're in Alberta, Canada using IP geolocation. If not, you'll see a fun message encouraging you to move to Alberta! You can still test the app by accepting that "moving to Alberta would be a great idea" ✅

### 2. Health Input Form
- **Age, gender, weight, height** - Basic body metrics
- **Blood pressure & BPM** - With "I don't know" options that estimate based on averages
- **Activity level** - From sedentary to very active
- **Caffeine tolerance** - Low, moderate, or high

### 3. Smart Caffeine Calculations
The app calculates your maximum safe daily caffeine intake by considering:
- Body weight (6mg per kg baseline)
- Blood pressure adjustments
- Heart rate considerations
- Age factors
- Personal tolerance levels

### 4. AI-Generated Schedule
Claude AI creates a personalized intake schedule with:
- Optimal timing throughout the day
- Specific amounts per session
- Reasoning for each recommendation
- Multiple format options (coffee, energy drinks, pills)

### 5. Beer Calculator (Just for Fun!)
Using the Widmark formula, the app calculates how many beers you can consume before productivity drops - purely educational! 🍺

---

## 🎨 Screenshots

<div align="center">

### Main Interface
*Clean, modern design with gradient backgrounds*

### Location Check
*Fun popup for non-Alberta visitors*

### Results Dashboard
*Comprehensive caffeine recommendations*

### AI Schedule
*Personalized intake timing throughout the day*

</div>

---

## 🧪 How It Works

### Caffeine Calculation Formula

```javascript
maxCaffeine = min(400mg, bodyWeight_kg × 6mg)

Adjustments:
- High BP (>130): × 0.7
- Very High BP (>140): × 0.5
- High HR (>80): × 0.8
- Very High HR (>90): × 0.6
- Age >50: × 0.85
- Age <25: × 0.9
- Low tolerance: × 0.7
- High tolerance: × 1.2
```

### Drink Equivalents
- ☕ **Coffee**: 95mg per cup
- ⚡ **Energy Drink**: 180mg per can
- 💊 **Caffeine Pill**: 200mg per pill

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

**Important Health Notice:**

This application is for **educational and entertainment purposes only**. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment.

- Always consult with a qualified healthcare provider before making changes to your caffeine intake
- Individual health conditions may require different caffeine limits
- The blood pressure and heart rate estimations are approximations only
- The beer calculator is purely for educational purposes - never drink and drive!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Your Name**

- GitHub: [@gplima89](https://github.com/gplima89)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/guillima)

---

## 🙏 Acknowledgments

- Built with ❤️ for Alberta, Canada
- Powered by [Claude AI](https://www.anthropic.com/) by Anthropic
- Icons by [Lucide](https://lucide.dev/)
- Inspired by the need to solve productivity challenges in Alberta
- Special thanks to the hackathon organizers!

---

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/alberta-caffeine-optimizer?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/alberta-caffeine-optimizer?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/YOUR_USERNAME/alberta-caffeine-optimizer?style=social)

</div>

---

<div align="center">

**Made with ☕ and 🧠 in Alberta, Canada**

If you find this project helpful, consider giving it a ⭐!

</div>
