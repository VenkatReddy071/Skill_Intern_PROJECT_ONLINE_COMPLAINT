const express=require("express");
const cors=require("cors");
const http=require("http");
const app=express();
const session = require('express-session');
const cookieParser=require('cookie-parser')
const MongoDBStore = require('connect-mongodb-session')(session);
const {Server}=require("socket.io");
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.error("Session store error:", error);
});

app.use(session({
  name: "session-id",
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }
}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connect=require("./Controllers/Connect.db");
const LoginRouter=require("./routes/login");
connect();


const server=http.createServer(app);
const io=new Server(server,{
cors:{
origin:'http://localhost:5173',
methods:["GET","POST"],
credentials:true
 }
});
const ComplaintRouter=require("./routes/ComplaintRouter");
const SocketOn=require("./routes/initializeSocketHandlers");
ComplaintRouter.setSocketIO(io);

app.get("/", (req, res) => {
    res.send("Hello from the MERN backend!");
});
app.use("/api",LoginRouter);
app.use('/api', ComplaintRouter);
SocketOn(io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO server also running on port ${PORT}`);
});