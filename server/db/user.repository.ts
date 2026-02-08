import { prisma } from "@/lib/prisma"



export const UserRepository = {
    async getUserById(id: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id
                }
            })
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }
}