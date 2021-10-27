import "mocha";
import sinon from 'sinon';
import { expect } from "chai";
import { MuseumController } from "../../src/controllers/museum-controller";
import { MuseumService } from "../../src/services/museum-service";
import { results } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/dts/results";

describe("MuseumController", () => {
	let controller: MuseumController;
	let museumService: MuseumService;
	
	beforeEach(() => {
		museumService = new MuseumService();
		controller = new MuseumController(museumService);
	});

	afterEach(() => {
		sinon.restore();
	});

    it('should have a status code 400 when date not provided', async () => {
        const response: JsonResult = await controller.getMusueumVisitors('');

        expect(response).to.be.an.instanceOf(results.JsonResult);
        expect(response.statusCode).to.equal(400);
    })

	it("should return visitors details with date filter", async () => {
		const date = "1404198000000";
		const data = {
			attendence: {
				month: "Jul",
				year: "2014",
				highest: {
					museum: "avila_adobe",
					visitors: 32378
				},
				lowest: {
					museum: "hellman_quon",
					visitors: 120
				},
				total: 60535,
			}
		};
		sinon.stub(museumService, 'getMuseumVisitors').resolves(data);

		let result = await controller.getMusueumVisitors(date);

		expect(result.statusCode).to.equals(200);
		expect(result.json).to.deep.equal(data);
	});

	it("should return visitors details with date filter param and ignored musuem param", async () => {
		const date = "1404198000000";
		const ignoreMuseum = "visitor_center_avila_adobe";
		const data = {
			attendence: {
				month: "Jul",
				year: "2014",
				highest: {
					museum: "avila_adobe",
					visitors: 32378
				},
				lowest: {
					museum: "hellman_quon",
					visitors: 120
				},
				total: 57008,
				ignored: {
					museum: "visitor_center_avila_adobe",
					visitors: 3527
				}
			}
		};
		sinon.stub(museumService, 'getMuseumVisitors').resolves(data);

        let result = await controller.getMusueumVisitors(date, ignoreMuseum);

		expect(result.statusCode).to.equals(200);
		expect(result.json).to.deep.equal(data);
	});
});
