import { Prisma } from "@prisma/client";

export type ExtensionContext<T = any> = {
    model: string ; 
    operation: string;
    args: T;
    query: (args: T) => Promise<any>  ; 
}

export type UserUpdateArgs = Prisma.UserUpdateArgs ; 
