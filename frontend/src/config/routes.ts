export const GC_API = 'https://storage.googleapis.com';
export const BUCKET = process.env.NEXT_PUBLIC_GCP_BUCKET;
export const MAIN_BACKEND = process.env.NEXT_PUBLIC_MAIN_BACKEND_URL;

export const MAIN_EXPLORE_URL = `${MAIN_BACKEND}/explore`;
export const POST_URL = `/posts`;

export const USER_PROFILE_PIC_URL = `${GC_API}/${BUCKET}/users/profilePics`;
export const USER_COVER_PIC_URL = `${GC_API}/${BUCKET}/users/coverPics`;
export const PROJECT_PIC_URL = `${GC_API}/${BUCKET}/projects`;
export const EVENT_PIC_URL = `${GC_API}/${BUCKET}/events`;
export const POST_PIC_URL = `${GC_API}/${BUCKET}/posts`;
export const GROUP_CHAT_PIC_URL = `${GC_API}/${BUCKET}/chats`;
export const APPLICATION_RESUME_URL = `${GC_API}/${BUCKET}/users/resumes`;
export const RESOURCE_URL = `${GC_API}/${BUCKET}/resources`;
export const COMMUNITY_PROFILE_PIC_URL = `${GC_API}/${BUCKET}/communities/profilePics`;
export const COMMUNITY_COVER_PIC_URL = `${GC_API}/${BUCKET}/communities/coverPics`;
