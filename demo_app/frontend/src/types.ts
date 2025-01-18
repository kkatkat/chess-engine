export type Move = string | {
    from: string;
    to: string;
    promotion?: string;
}