import colors from 'colors'
import mongoose from "mongoose"

export const connectDB = async () => {

    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        console.log(colors.bgBlue.white.bold('DB CONNECTED SUCCESFULLY'))
    }
    catch (e) {
        console.log(e.message)
        console.log(colors.bgRed.white.bold('CANNOT CONNECT TO DB'))

        process.exit(1)
    }
}