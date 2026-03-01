// =============================
// PROGRESS TRACKER
// =============================

const {
  getStudentProgress,
  addProgress,
  deleteProgress
} = require("../controllers/studentController"); // ✅ import ONCE at top

router.get("/tracker", auth, getStudentProgress);

// ✅ ADMIN ONLY — Add tracker
router.post("/tracker/add", auth, (req, res) => {

  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied ❌" });
  }

  return addProgress(req, res);
});

// ✅ ADMIN ONLY — Delete tracker
router.delete("/tracker/:id", auth, (req, res) => {

  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access denied ❌" });
  }

  return deleteProgress(req, res);
});