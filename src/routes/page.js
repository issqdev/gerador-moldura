import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => res.sendFile('/pages/upload.html', { root: './public' }));

router.get('/moldura', (req, res) => res.sendFile('/pages/moldura.html', { root: './public' }));

router.get('/preview', (req, res) => res.sendFile('/pages/preview.html', { root: './public' }));

export default router;