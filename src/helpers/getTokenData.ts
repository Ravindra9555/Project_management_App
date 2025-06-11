// helpers/getTokenData.ts
import jwt from "jsonwebtoken";

export const getTokenData = async (req: Request) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  // console.log(token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string, email: string };
  } catch (err) {
    console.log(err)
    return null;
  }
};
