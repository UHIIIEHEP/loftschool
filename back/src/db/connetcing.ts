import {createConnection} from "typeorm";
import config from "./config";

export default createConnection(config);
