// server.js
import express from 'express';
import path from 'path';
import apiRoutes from './src/routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.static(path.join(path.resolve(), 'public'))); 

app.use('/api', apiRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
