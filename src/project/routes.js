const {Router} = require('express');
const controller = require('./controller');

const router = Router();

router.get("/", controller.getProjects);
router.get("/:id", controller.getProjectById);
router.post("/", controller.addProject);
router.put("/:id", controller.updateProject);
router.delete("/:id", controller.deleteProject);

module.exports = router;