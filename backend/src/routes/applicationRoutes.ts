import { Router } from 'express';
import * as controller from '../controllers/applicationController';

const router = Router();

router.get('/', controller.getApplications);
router.get('/:id', controller.getApplicationById);
router.post('/', controller.createApplication);
router.patch('/:id', controller.updateApplication);
router.delete('/:id', controller.deleteApplication);

export default router;
