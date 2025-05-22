require('dotenv').config()
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();
app.use(express.json());

// Route mẫu
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello' });
});

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(4000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
