import bcrypt from 'bcrypt'
export const hashPassword=async(password:string)=>{
   const salt= await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}

export const verifyPassword=async(storedPassword:string, inputPassword)=>{
    return await bcrypt.compare(inputPassword,storedPassword)
}