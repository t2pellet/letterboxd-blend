import { RequestHandler } from "express";
import { getData } from "@/utils/data";
import { BlendParams, getBlendedList } from "@/utils/blend";

const getBlendHandler: RequestHandler = async (req, res) => {
  const params = getData<BlendParams>(req);
  const results = await getBlendedList(params);
  res.status(200).send(results);
};

export { getBlendHandler };
