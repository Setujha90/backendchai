import multer from 'multer' 

const storage = multer.diskStorage({ // Configuring multer to store files on disk
  destination: function (req, file, cb) { // Setting the destination folder for uploaded files
    cb(null, "./public/temp") //specifying the folder where files will be stored
  },
  filename: function (req, file, cb) { // Setting the filename for the uploaded files
    cb(null, file.originalname) // Using the original file name for the uploaded file
  }
})

export const upload = multer({ storage: storage }) 