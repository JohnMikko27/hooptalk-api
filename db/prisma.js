const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
    // await prisma.comment.create({
    //     data: {
    //         content: "second comment",
    //         authorId: 1,
    //         postId: 1
    //     }
    // })
    // const allUsers = await prisma.user.findMany({ include: {posts: true, comments: true}})
    // console.dir(allUsers, { depth: null })
}
  
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })