import multer               from 'multer';

import { validMimeTypes }   from '../utils';
import { AppError }         from '../utils/AppErros';

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {

        if (!validMimeTypes.includes(file.mimetype)) {
            return cb(new AppError('Invalid file type. Only JPEG, PNG, JPG, MP4 are allowed.', 400));
        }
        cb(null, true);
    },
});

export default upload;