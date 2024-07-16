# Video Demo



https://github.com/user-attachments/assets/262e0e51-9d21-4c3e-b5f6-e8d78ad2660f


## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (or use a cloud-based MongoDB service like MongoDB Atlas)
- Git

### Installation
1. Clone the repository:
```bash
 git clone https://github.com/your-username/ChatBotOCR.git
 cd ChatBotOCR
 ```

2. Install frontend dependencies:
  ```bash
   cd client
   npm install
 
  ```

3. Install backend dependencies:
```bash
  cd ../server
  npm install
```

4. Set up environment variables:
Create a .env file in the server directory with the following contents:
```
MONGO_URL=mongodb+srv://saurabhparyani:mysecretpassword@cluster0.ohsu6lx.mongodb.net/
```

5. Start the frontend and backend servers:
Frontend (in client directory):
```npm run dev```
Backend (in server directory):
```npm start```
Open your browser and go to http://localhost:5173 to see the application running.
