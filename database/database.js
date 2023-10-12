const mongoose = require("mongoose");
const {env} = require("../utils/constants")


const connectDataBase = () => {

  mongoose
    .connect(env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDataBase;
