import "mocha";
import sinon from "sinon";
("sinon");
import { expect } from "chai";
import { MuseumService } from "../../src/services/museum-service";

describe("MuseumService", () => {
	let service: MuseumService;
	let apiResponseData: any;
	beforeEach(() => {
		service = new MuseumService();
		apiResponseData = [
			{
				month: "2014-06-01T00:00:00.000",
				america_tropical_interpretive_center: "11036",
				avila_adobe: "29487",
				chinese_american_museum: "2121",
				firehouse_museum: "5751",
				hellman_quon: "255",
				pico_house: "355",
				visitor_center_avila_adobe: "3133"
			},
			{
				month: "2014-07-01T00:00:00.000",
				america_tropical_interpretive_center: "13490",
				avila_adobe: "32378",
				chinese_american_museum: "2239",
				firehouse_museum: "5406",
				hellman_quon: "120",
				pico_house: "3375",
				visitor_center_avila_adobe: "3527"
			}
		];
	});

	afterEach(() => {
		sinon.restore();
	});

	it("should return visitors details with date filter", async () => {
		const date = new Date(parseInt("1404198000000"));
		const result = {
			attendence: {
				month: "Jul",
				year: "2014",
				highest: {
					museum: "avila_adobe",
					visitors: 32378,
				},
				lowest: {
					museum: "hellman_quon",
					visitors: 120,
				},
				total: 60535,
			},
		}
		sinon.stub(service, "fetchDataFromAPI").resolves(apiResponseData);

		const response = await service.getMuseumVisitors(date);

		expect(response).to.deep.equal(result);
	});

	it("should return visitors details with date filter param and ignored musuem param", async () => {
		const date = new Date(parseInt("1404198000000"));
		const ignoreMuseum = "visitor_center_avila_adobe";
		const result = {
			attendence: {
				month: "Jul",
				year: "2014",
				highest: {
					museum: "avila_adobe",
					visitors: 32378,
				},
				lowest: {
					museum: "hellman_quon",
					visitors: 120,
				},
				total: 57008,
				ignored: {
					museum: "visitor_center_avila_adobe",
					visitors: 3527,
				},
			},
		};
		sinon.stub(service, "fetchDataFromAPI").resolves(apiResponseData);

		const response = await service.getMuseumVisitors(date, ignoreMuseum);

		expect(response).to.deep.equal(result);
	});

	it('mapResponse function should return empty if no result found for specified date', async () => {
		const date = new Date(parseInt("4404198000000"));
		sinon.stub(service, "fetchDataFromAPI").resolves(apiResponseData);

		const response = await service.getMuseumVisitors(date);
		expect(response).to.be.undefined;
	})

	it('should return list of visitors from external api', async () => {
		const response = await service.fetchDataFromAPI();

		expect(response).to.be.an.instanceOf(Array);
		expect(response.length).to.gt(0);
	});
});
