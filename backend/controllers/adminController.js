import User from "../models/User.js";
import ExcelRecord from "../models/ExcelRecord.js";
import ChartConfig from "../models/ChartConfig.js";

/* GET  /api/admin/stats  ───────────────────────── */
export const getStats = async (_req, res, next) => {
  try {
    const [totalUsers, totalUploads, chartAgg] = await Promise.all([
      User.countDocuments(),
      ExcelRecord.distinct("uploadId").then(arr => arr.length),
      ChartConfig.aggregate([
        { $group: { _id: "$chartType", count: { $sum: 1 } } },
      ]),
    ]);

    const mostUsedCharts = chartAgg.reduce((acc, c) => {
      acc[c._id] = c.count;
      return acc;
    }, {});

    res.json({ totalUsers, totalUploads, mostUsedCharts });
  } catch (err) {
    next(err);
  }
};

/* GET  /api/admin/users  ────────────────────────── */
export const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/* PATCH  /api/admin/users/:id/block  ────────────── */
export const blockUser = async (req, res, next) => {
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(u);
  } catch (err) {
    next(err);
  }
};

/* DELETE  /api/admin/users/:id  ─────────────────── */
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
