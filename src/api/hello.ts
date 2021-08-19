import * as type from '../types';
import { Router } from "express";

const router = Router();

router.get("/", hello);

async function hello(req: type.IClientRequest, res: type.IServerResponse, next: type.dynamicFunction) {
  try {
    res.writeHead(200);
    res.end("Hello!");
  } catch (err) {
    next(err);
  }
}

export default router;
