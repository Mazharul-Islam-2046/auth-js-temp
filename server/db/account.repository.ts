import { prisma } from "@/lib/prisma";

export const AccountRepository = {
    async getAccountById(userId: string) {
        try {
            const account = await prisma.account.findFirst({
            where: {
                userId
            }
        })
        return account;
        } catch (error) {
            console.log(error);
            return null
        }
        
    },
}