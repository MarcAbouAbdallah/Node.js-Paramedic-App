# QuickAid MTL 🚑

Welcome to QuickAid MTL, an Emergency Medical Service (EMS) platform designed to connect people in need of urgent medical help with nearby paramedics in the Montreal area. The app ensures fast response times through real-time communication using WebSockets, allowing both patients and paramedics to receive immediate alerts and updates.

## 🎬 **Demo Video**
[Watch the demo video here](https://youtu.be/OSspQKkfC3A)

---

## 💻 **Tech Stack**

- **Node.js & Express.js** (Backend) 🛠️
- **MongoDB & Mongoose** (Database & ORM) 📑
- **Socket.IO** (Real-Time Communication) 🆘
- **MapBox GL JS** (Mapping & Geolocation) 📍
- **JWT - JSON Web Token** (Authentication) 🔐
- **JavaScript, HTML & CSS** (Frontend) 🎨

---

## 🚀 **Features**  

- **Real-time Alerts**  
  Notifications are sent instantly using **WebSockets** to alert patients and paramedics.  

- **Location-based Emergency**  
  Geospatial indexes in **MongoDB** and interactive **MapBox** maps (autocomplete geocoder, markers, etc.) track user locations for nearby emergencies, with paramedics being alerted only within a 2 km range.  

- **Authentication & Security**  
  **JWT** for secure authentication and **bcrypt** for password hashing.  

- **Heat Map**  
  Displays a heat map to show the density and patterns of pending and accepted requests.  

- **MongoDB**  
  Stores emergency information and tracks patient and paramedic history.

