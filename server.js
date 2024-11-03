import express from 'express';
import path from 'path';
import apiRoutes from './src/routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use('/api', apiRoutes); 

app.get('/hillclimb', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hillclimb.html'));
});

app.get('/sidewaysmove', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hillclimb.html'));
});
app.get('/randomrestartHC', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hillclimb.html'));
});

app.get('/simulatedannealing', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'simulatedannealing.html'));
});

app.get('/geneticalgorithm', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'geneticalgorithm.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
