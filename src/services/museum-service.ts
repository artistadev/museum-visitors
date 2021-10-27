import { injectable } from "inversify";
import axios from "axios";
import { VisitorsResponse } from "@/models/visitor.model";

@injectable()
export class MuseumService {
	constructor() {}

    /**
     * Function returns musuem visitors info 
     * @param { Date } date param passed to function for filtering response
     * @param { String } ignoredMuseum  param passed to function to ignore musuem. optional
     * @returns { VisitorsResponse } visitor stats
     */
	async getMuseumVisitors(date: Date, ignoredMuseum?: string): Promise<VisitorsResponse> {
        let result = await this.fetchDataFromAPI();
		return this.mapResponse(result, date, ignoredMuseum);
	}

    /**
     * function fetches data from external api
     * @returns { any[] } array of visitors in each museum by month
     */
    async fetchDataFromAPI(): Promise<any[]> {
        const url = 'https://data.lacity.org/resource/trxm-jn3c.json';

        let result = await axios.get<any[]>(url);
        return result.data;
    }

    /**
     * function maps the result from api into required response model
     * @param { any } result param visitor data returned by external api
     * @param { Date } date date for filtering data
     * @param { string? } ignoredMuseum optional musuem name to ignore. optional field
     * @returns { VisitorsResponse } mapped response
     */
    private mapResponse(result: any[], date: Date, ignoredMuseum?: string): VisitorsResponse {
        let response: VisitorsResponse;
        let filteredResult = result.find(x => {
            let tempDate = new Date(x.month);
            return tempDate.getMonth() == date.getMonth() && tempDate.getFullYear() == date.getFullYear();
        });
        if (filteredResult) {
            let attendence = {
                total: 0,
                highestVisitorCount: 0,
                lowestVisitorCount: Number.MAX_SAFE_INTEGER,
                ignoredMuseumVisitorCount: 0,
                highestVisitedMuseum: '',
                lowestVisitedMuseumName: '',
                ignoredMusueumName: ''
            };

            Object.keys(filteredResult).forEach((key: string) => {
                if (key != "month" && key != ignoredMuseum) {
                    attendence.total += parseInt(filteredResult[key]);
                    if (parseInt(filteredResult[key]) > attendence.highestVisitorCount) {
                        attendence.highestVisitorCount = parseInt(filteredResult[key]);
                        attendence.highestVisitedMuseum = key;
                    }
                    if (parseInt(filteredResult[key]) < attendence.lowestVisitorCount) {
                        attendence.lowestVisitorCount = parseInt(filteredResult[key]);
                        attendence.lowestVisitedMuseumName = key;
                    }
                } else if (ignoredMuseum && ignoredMuseum == key) {
                    attendence.ignoredMuseumVisitorCount += parseInt(filteredResult[key]);
                    attendence.ignoredMusueumName = key
                }
            });

            response = {
                attendence: {
                    month: date.toLocaleString('default', { month: 'short' }),
                    year: date.getFullYear().toString(),
                    highest: {
                        museum: attendence.highestVisitedMuseum,
                        visitors: attendence.highestVisitorCount,
                    },
                    lowest: {
                        museum: attendence.lowestVisitedMuseumName,
                        visitors: attendence.lowestVisitorCount,
                    },
                    total: attendence.total,
                },
            };
            if (attendence.ignoredMusueumName) {
                response.attendence.ignored = {
                    museum: ignoredMuseum,
                    visitors: attendence.ignoredMuseumVisitorCount,
                };
            }
        }
        return response;
    }
}
