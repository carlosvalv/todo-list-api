const {Router} = require('express');
const controller = require('./controller');

const router = Router();

router.get("/", controller.getTasks);
router.get("/:id", controller.getTaskById);
router.get("/project/:projectId", controller.getTaskByProjectId);
router.post("/", controller.addTask);
router.put("/order/", controller.orderTasks);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);

module.exports = router;