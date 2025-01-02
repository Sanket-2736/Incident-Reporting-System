const mongoose = require('mongoose')

module.exports = connectDB = async () => {
    try {                
        await mongoose.connect(process.env.CONN_STR, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error in connecting to database" + error);
        throw error;
    }
}