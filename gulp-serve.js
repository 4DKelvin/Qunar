var express = require("express"),
    app = express();
app.use(express.static('./serve')).listen(3001);