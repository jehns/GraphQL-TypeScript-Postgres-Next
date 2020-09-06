import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import {Request, Response, Express} from 'express'

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {session: Express.Session}; // "&" sign joins types. this fixes session can be undefined typescript error.
  res: Response;
}
