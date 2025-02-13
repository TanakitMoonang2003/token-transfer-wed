import express from "express";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash"; // flash ต้องใช้ connect-flash
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://admin:1234@cluster0.6svk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

global.loggedIn = null; // Global loggedIn variable

// Import controllers
import indexControllers from './controllers/indexControllers.js';
import loginControllers from './controllers/loginControllers.js';
import registerControllers from './controllers/registerControllers.js';
import storeUserControllers from './controllers/storeUserControllers.js';
import loginUserControllers from './controllers/loginUserControllers.js';
import logoutControllers from './controllers/logoutControllers.js';
import homeControllers from './controllers/homeControllers.js';
import index1Controllers from './controllers/index1Controllers.js';
import home1Controllers from './controllers/home1Controllers.js';
import aboutControllers from './controllers/aboutControllers.js';
import aboutinConrollers from "./controllers/aboutinConrollers.js";
import transferControllers from './controllers/transferControllers.js';
import createControllers from "./controllers/createControllers.js";


// Import middlewares
import redirectIfAuth from './middleware/redirectlfAuth.js';
import authMiddleware from './middleware/authMidleware.js';

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: 'node secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use("*", (req, res, next) => {
    global.loggedIn = req.session.userId;
    next();
});

// Routes
app.get('/index1', indexControllers);
app.get('/', index1Controllers);
app.get('/home', authMiddleware, homeControllers);
app.get('/home1', authMiddleware, home1Controllers);
app.get('/login', redirectIfAuth, loginControllers);
app.get('/register', redirectIfAuth, registerControllers);
app.get('/logout', logoutControllers);
app.get('/about', aboutControllers);
app.get('/aboutin', aboutinConrollers);
app.get('/transfer', transferControllers);
app.get('/create',createControllers);
app.post('/user/register', redirectIfAuth, storeUserControllers);
app.post('/user/login', loginUserControllers);



// Start server
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
