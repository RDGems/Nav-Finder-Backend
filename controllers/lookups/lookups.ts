import { Request, Response } from 'express';
import { ApiError } from "../../utils/error/Apierror";
import { ApiResponse } from "../../utils/error/ApiResponse";
import { asyncHandler } from '../../utils/error/AsyncHandler';
import { lookupData } from '../../utils/common/lokkupsData';



export const lookups = asyncHandler(async (req: Request, res: Response) => {
    const {lookups} = req.body;
    let result: any = {};
    if(lookups && lookups.length > 0){
        lookups.forEach( (lookup: string) => {
            if (lookup in lookupData) {
                result[lookup] = lookupData[lookup as keyof typeof lookupData];
              }
        });
    }
    return res.status(200).json(new ApiResponse(200, result,'Lookups' ));
});