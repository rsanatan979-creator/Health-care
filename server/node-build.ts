import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Health-care server running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down");
  process.exit(0);
});
