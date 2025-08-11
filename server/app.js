import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import busboyBodyParser from 'busboy-body-parser';
import connectDB from './db/index';
import { PORT, NODE_ENV } from './constants';
import ActivateRoutes from './routes';

connectDB();

const app = express();

app.use(cors({
  origin: '*', // Ensure this matches your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
  credentials: true, // Include credentials if needed (cookies, auth headers)
}));
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer'); // Adjust as needed
  next();
});

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(busboyBodyParser());
ActivateRoutes(app);
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (_, res) => {
    res.send(`<h1>Paint Plus ${NODE_ENV} Server</h1>`);
});

const port = PORT || 3001;
try {
    app.listen(port, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.log('Error while running server', error);
}

export default app;
