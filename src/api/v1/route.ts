import {Router} from "express";
import helloRoute from "@/api/v1/hello/route";


const router = Router();

router.use('/hello', helloRoute);

export default router;
