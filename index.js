const express = require('express');
const app = express();
const port = 3000;

app.use('/api', require('./routers/api'));
app.all('/' , (req, res) => {
    res.send('cwp-15, © Kiril, 2018');
})

app.listen(port, () =>
{
    console.log('Example app listening on port 3000!..');
})