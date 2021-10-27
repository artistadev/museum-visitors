import { VisitorsResponse } from "@/models/visitor.model";
import { inject } from "inversify";
import { BaseHttpController, controller, httpGet, queryParam } from "inversify-express-utils";
import { BadRequestResult, JsonResult } from "inversify-express-utils/dts/results";
import { MuseumService } from "../services/museum-service";
import TYPES from "../types";

@controller("/api/visitors")
export class MuseumController extends BaseHttpController {
	constructor(@inject(TYPES.MuseumService) private readonly museumService: MuseumService) {
		super();
	}

	/**
	 * GET API returns the different visitors info i.e. highest/lowest visitors count and museum names, total visitors in a month.
	 * @param { string } date query param to filter visitor data(in milliseconds)
	 * @param { String? } ignore query param to ignore musuem. optional param
	 */
	@httpGet("/")
	async getMusueumVisitors(@queryParam("date") date: string, @queryParam("ignore") ignore?: string): Promise<JsonResult> {
		if (date) {
			let searchDate = new Date(parseInt(date));
			let result = await this.museumService.getMuseumVisitors(searchDate, ignore);
			return this.json(result, 200);
		}
		return this.json({ errorMessage: "date not provided" }, 400);
	}
}