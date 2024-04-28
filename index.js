const express = require('express');
const app = express();
const port = process.env.PORT || 5000;


// Middleware


app.get('/', (req, res) => {
    res.send(`Art & Craft Server is running`)
})

app.listen(port, () => {
    console.log(`Server Listen on port ${port}`)
})