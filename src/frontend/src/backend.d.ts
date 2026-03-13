import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Donor {
    id: Principal;
    age: bigint;
    contact: string;
    name: string;
    lastDonationDate: Time;
    bloodGroup: string;
}
export interface BloodStock {
    bloodGroup: string;
    unitsAvailable: bigint;
}
export interface UserProfile {
    id: Principal;
    name: string;
    email?: string;
    timeCreated: Time;
}
export interface Request {
    id: bigint;
    status: Variant_pending_approved_rejected;
    user: Principal;
    bloodGroup: string;
    units: bigint;
    requestDate: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addDonor(donor: Donor): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    countRequestsByStatus(status: Variant_pending_approved_rejected): Promise<bigint>;
    createRequest(bloodGroup: string, units: bigint): Promise<void>;
    getAllBloodStock(): Promise<Array<BloodStock>>;
    getAllDonors(): Promise<Array<Donor>>;
    getBloodStock(bloodGroup: string): Promise<BloodStock | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDonor(id: Principal): Promise<Donor | null>;
    getRequestsByStatus(status: Variant_pending_approved_rejected): Promise<Array<Request>>;
    getRequestsByUser(user: Principal): Promise<Array<Request>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initSampleData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerProfile(name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBloodStock(stock: BloodStock): Promise<void>;
    updateRequestStatus(requestId: bigint, newStatus: Variant_pending_approved_rejected): Promise<void>;
}
