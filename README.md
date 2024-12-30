# 🚑 Emergency Medical Service (EMS) App

**A full-stack application designed to connect people in need of urgent medical help with nearby paramedics in the Montreal area.** This app ensures fast response times through real-time communication using WebSockets.

---

## 🌐 Tech Stack

- **Node.js/Express.js**: Backend server for handling API requests.
- **Socket.IO**: Library for WebSocket communication between patients and paramedics.
- **MongoDB**: Database to store information about paramedics, patients, and emergencies.
- **MapBox GL JS**: Interactive maps for visualizing user locations and emergency data.

---

## 🛠️ How the App Works

1. **Patient Requests Help** 🆘:
   - A patient enters their location using an autocomplete feature on the map.
   - They press an "Emergency" button, which sends an alert to nearby paramedics (within 2 km).

2. **Paramedics Receive Alerts** 🚨:
   - Paramedics get a message with the patient's location, which appears as a marker on their map.
   - They can choose to accept the alert and assist the patient.

3. **Real-time Updates** 🗺️:
   - When a paramedic accepts an alert, the patient is notified.
   - The paramedic's location appears as a marker on the patient's map for tracking.

4. **Heat Map for Emergency Incidents** 🔥:
   - A heat map displays all active and completed emergencies in Montreal, indicating the status of each incident.

---

## 🚧 Project Status

⚠️ **Under Construction**: The EMS app's front-end is currently in development. Features are being refined and optimized for better user experience.
