import e, { Request } from 'express'
import multer from 'multer'
import { ApiError } from '../utils/error/Apierror'



// create a storage function
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, './public/temp')
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({
    storage: storage, limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb(new ApiError(400, "File type is not supported", []))
        }
        if (file.size > 5 * 1024 * 1024) {
            cb(new ApiError(400, "File size is too large", []))
        }
    }
})
export default upload