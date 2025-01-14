import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app: Application = express();
const PORT = 2333;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example Route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is the TypeScript backend for your React Native app!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
