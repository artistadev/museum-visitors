interface Museum {
    museum: string;
    visitors: number;
}

interface Attendence {
    month: string;
    year: string;
    highest: Museum;
    lowest: Museum;
    total: number;
    ignored?: Museum;
}

export interface VisitorsResponse {
    attendence: Attendence;
}