import type { Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
    const path = req.path;
    return res.status(404).send({
        message: `Oops.. resource '${path}' do not exists.`,
    });
};
