import jwt from 'jsonwebtoken';
import TryCatch from "../middlewares/trycatch.js";
import prisma from "../prisma.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email, name, picture } = req.body;
    let user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        user = await prisma.user.create({
            data: { name,
                email,
                image: picture,
            },
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "15d",
    });
    res.status(200).json({
        message: "Logged Success",
        token,
        user,
    });
});
