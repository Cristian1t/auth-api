import express from 'express';

const router = express.Router();

router.post("/api/users", (req, res) => {
  res.send("User created");
  res.sendStatus(200);
});

export default router;