import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
interface mailOptions {
    email: string,
    subject: string,
    mailgenContent: any
}
interface AvatarUser {
    userName: string;
}
interface AuthRequest extends Request {
    user?: JwtPayload;
    file?: any;
}
export { mailOptions, AvatarUser, AuthRequest }