import {Name} from "@/types/slugTypes";
import safeMiddleware from "@/utils/safe-middleware";

const helloWorld = safeMiddleware(async (req, res) => {
  const {name} = req.validatedParams<Name>();
  res.send(`Hello, ${name}!`);
});

export default helloWorld;
