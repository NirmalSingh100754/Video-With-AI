// here we declare types for the application
import { Connection } from "mongoose";


declare global
{
    var mongoose:
    {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    }
}

export {};