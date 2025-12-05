import mongoose from "mongoose"

mongoose.connect('mongodb+srv://admin:admin123@cluster0.gtns9g8.mongodb.net/livraria?appName=Cluster0');

let db = mongoose.connection;

export default db;