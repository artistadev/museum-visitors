import { Container } from "inversify";
import { MuseumService } from "./services/museum-service";
import TYPES from "./types";

import './controllers/museum-controller';


const container = new Container();

container.bind<MuseumService>(TYPES.MuseumService).to(MuseumService);

export default container;