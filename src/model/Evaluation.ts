export default interface Evaluation {
    id: number;
    evaluatorId: number;
    evaluatedId: number;
    evaluation: string;
    score: number;
    advertisementId: number;
    postingDateTime: Date;
}