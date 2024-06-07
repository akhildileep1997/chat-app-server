import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDb from "./config/Db.js";
import multer from 'multer'
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// Import routes
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import protectRoute from "./middleware/protectedRoute.js";
import { updateUserDetailsController } from "./controller/userController.js";

const app = express();

//for socket purpose
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

//multer part
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Serve static files
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images"))
);

//route for update
app.post("/user/update-details/:id", protectRoute,upload.single('profilePic'), updateUserDetailsController);


const userSocketMap = {}; // to store user id which is socket id

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]; 
};

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // For online checking
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  //for online logged in users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Clearing while disconnecting
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));//updating again after delete
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
server.listen(PORT, () => {
  connectDb();
  console.log("App listening on port " + PORT);
});

export { io };
