import { getMe } from "./userService.js";

export async function isAuthenticated() {
    try {
        const res = await getMe();
        return res && res.user;
    } catch {
        return false;
    }
}