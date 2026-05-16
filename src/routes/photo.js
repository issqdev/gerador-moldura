import { Router } from 'express';

const router = Router();

let uploadedPhoto = null;

router
    .route('/')
    .get((req, res) => {
        if (!uploadedPhoto) {
            return res.status(400).json({ error: 'Nenhuma foto disponível' });
        }
    
        res.json({ photoUrl: uploadedPhoto });
    })
    .post((req, res) => {
        const { photo } = req.body;

        if (!photo) {
            return res.status(400).json({ error: 'Nenhuma foto recebida' });
        }

        uploadedPhoto = photo;
        console.log('Foto recebida:', photo.substring(0, 100)); // só para teste

        res.json({ message: 'Foto recebida com sucesso' });
    })

export default router;