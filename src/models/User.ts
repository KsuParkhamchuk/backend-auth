// import { PrismaClient, User } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// const prisma = new PrismaClient()

// export const createUser = async (
//     name: string,
//     email: string,
//     password: string,
// ): Promise<User> => {
//     const hashedPassword = await bcrypt.hash(password, 10)
//     return prisma.user.create({
//         data: {
//             name,
//             email,
//             password: hashedPassword,
//         },
//     })
// }

// export const findUserByEmail = async (email: string): Promise<User | null> => {
//     return prisma.user.findUnique({ where: { email } })
// }

// export const findUserById = async (id: number): Promise<User | null> => {
//     return prisma.user.findUnique({ where: { id } })
// }
