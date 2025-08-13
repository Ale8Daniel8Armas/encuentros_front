import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const app = express()
app.use(cors())
const upload = multer({ dest: 'tmp/' })

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})

// POST /upload -> sube a Cloudinary y devuelve { url, public_id }
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // // RUTA PARA SUBIR IMAGEN CLOUDINARY
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'encuentros'
    })
    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'upload_failed' })
  }
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`[upload] listening on ${port}`))
