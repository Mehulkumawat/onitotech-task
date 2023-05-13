
 

const mongoose = require("mongoose");

// TODO: Add listener so that we know when database started
// TODO: Don't store password directly as we need to send this code to the company.
const connectDb = () => {
  mongoose.connect("mongodb+srv://mehkumawat:vr1TqPGjhEUrludz@users-cluster.dc97nt5.mongodb.net/onitotech");
}

module.exports = { connectDb };
