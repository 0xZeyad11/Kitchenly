import { Response } from "express";

export type ApiResponse = {
  status: "success" | "failed";
  statusCode: number;
  message?: string;
  data?: any;
};

export const apiResponse = (
  res: Response,
  status: "success"  | "failed",
  statuscode: number,
  data?: any,
  message?: string,  

): Response => {
  const apiResponse: ApiResponse = {
    status: status,
    statusCode: statuscode,
    data,
   message,
  };
  return res.status(statuscode).json(apiResponse);
};


