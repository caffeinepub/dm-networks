import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SerializableUserProfile {
    bio: string;
    currentProjects: string;
    programmingLanguages: string;
    displayName: string;
    activityInterests: string;
    socialLinks: Array<string>;
    number: string;
    visibility: ProfileVisibility;
    skills: string;
}
export interface PublicProfile {
    principal: Principal;
    profile: SerializableUserProfile;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: bigint;
}
export enum ProfileVisibility {
    privateVisibility = "privateVisibility",
    publicVisibility = "publicVisibility"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatMessage(content: string): Promise<bigint>;
    deleteChatMessage(messageId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<SerializableUserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessages(): Promise<Array<ChatMessage>>;
    getMemberDirectory(): Promise<Array<PublicProfile>>;
    getUserProfile(user: Principal): Promise<SerializableUserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: SerializableUserProfile): Promise<void>;
}
