import {Router} from "express";
import slugValidator from "@/middleware/slugValidatorMiddleware";
import {nameSchema} from "@/validators/slug";
import helloWorld from "@/api/v1/hello/helloWorld";


const router = Router();

router.get('/:name?', slugValidator(nameSchema), helloWorld);

export default router;
