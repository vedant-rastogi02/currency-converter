require("dotenv").config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const PORT =process.env.PORT || 5000;
const app = express();
const axios = require('axios');
const cors = require('cors');

const API_KEY=process.env.API_KEY;
const API_URL=process.env.API_URL;
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
 
});
// cors middleware
const corsOptions = {
  origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(apiLimiter);

// routes
app.post('/api/convert', async (req, res) => {
    try {
      const { from, to, amount } = req.body;
       const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);
    if (response.data && response.data.result === "success") {
      res.json({
        base: from,
        target: to,
        conversionRate: response.data.conversion_rate,
        convertedAmount: response.data.conversion_result,
      });
    } else {
      res.json({
        message: "Error converting currency",
        details: response.data,
      });
    }
    }
    catch (error) {}
        res.json({ message: "Error converting currency", details: error.message });
})


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
