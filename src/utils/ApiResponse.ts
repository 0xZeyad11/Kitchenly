import { Response } from "express";

export type ApiResponse = {
  status: "success" | "failed";
  statusCode: number;
  message?: string;
  data?: any;
  length?: number;
};

export const apiResponse = (
  res: Response,
  status: "success" | "failed",
  statuscode: number,
  data?: any,
  message?: string,
  length?: number,
): Response => {
  const apiResponse: ApiResponse = {
    status: status,
    statusCode: statuscode,
    length,
    data,
    message,
  };
  return res.status(statuscode).json(apiResponse);
};
