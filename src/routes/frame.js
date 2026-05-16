import { Router } from 'express';

const router = Router();

let uploadedFrame = null;

router
    .route('/')
    .get((req, res) => {
        if (!uploadedFrame) {
            return res.status(400).json({ error: 'Nenhuma moldura disponível' });
        }

        res.json({ frame: uploadedFrame });
    })
    .post((req, res) => {
        const { frame } = req.body;

        if (!frame) {
            return res.status(400).json({ error: 'Nenhuma moldura recebida' });
        }

        uploadedFrame = frame;
        console.log('Moldura Recebida:', frame);

        res.json({ message: 'Moldura recebida com sucesso' })
    })

export default router;