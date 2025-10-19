// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/api/sellers", require("./routes/sellerRoutes"));

// // Error Middleware
// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const seedAdminUser = require('./config/seed');

dotenv.config();
connectDB().then(() => {
  seedAdminUser(); // 2. Run the seeder after DB connection
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api',(req,res)=>res.send("API is running..."));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
// app.use("/payment", require("./routes/paymentRoutes"));
// app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/sellers", require("./routes/sellerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use('/api/cart', require('./routes/cartRoutes')); // Add this line


// Error middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export default app;