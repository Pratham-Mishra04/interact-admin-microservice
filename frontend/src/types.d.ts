export interface Log {
  id: string;
  level: string;
  title: string;
  description: string;
  path: string;
  resource: string;
  timestamp: Date;
}

export interface LogUser {
  id: string;
  username: string;
  role: string;
}

export interface Comment {
  id: string;
  userID: string;
  user: User;
  postID: string;
  post: Post;
  projectID: string;
  project: Project;
  content: string;
  noLikes: number;
  likedBy: string[];
  createdAt: Date;
}

export interface Post {
  id: string;
  userID: string;
  rePostID: string;
  rePost: Post | null;
  images: string[];
  content: string;
  user: User;
  noLikes: number;
  noShares: number;
  noComments: number;
  noImpressions: number;
  noReposts: number;
  isRePost: boolean;
  postedAt: Date;
  tags: string[];
  hashes: string[];
  isEdited: boolean;
  taggedUsers: User[];
}

export interface User {
  id: string;
  tags: string[];
  links: string[];
  email: string;
  name: string;
  resume: string;
  active: boolean;
  profilePic: string;
  coverPic: string;
  username: string;
  phoneNo: string;
  bio: string;
  title: string;
  tagline: string;
  followers: User[];
  following: User[];
  posts: Post[];
  projects: Project[];
  noFollowers: number;
  noFollowing: number;
  noImpressions: number;
  noProjects: number;
  noCollaborativeProjects: number;
  isFollowing?: boolean;
  isOnboardingComplete: boolean;
  passwordChangedAt: Date;
  lastViewed: Project[];
  isVerified: boolean;
  isOrganization: boolean;
}

export interface Project {
  id: string;
  slug: string;
  userID: string;
  title: string;
  tagline: string;
  coverPic: string;
  blurHash: string;
  description: string;
  page: string;
  user: User;
  likedBy: User[];
  comments: Comment[];
  noLikes: number;
  noShares: number;
  noComments: number;
  noImpressions: number;
  tags: string[];
  category: string;
  openings: Opening[];
  hashes: string[];
  isPrivate: boolean;
  views: number;
  totalNoViews: number;
  noMembers: number;
  privateLinks: string[];
  links: string[];
  createdAt: Date;
}

export interface Opening {
  id: string;
  projectID: string;
  project: Project | null;
  userID: string;
  user: User;
  title: string;
  description: string;
  applications: [];
  noApplications: number;
  noImpressions: number;
  tags: string[];
  active: boolean;
  createdAt: Date;
}
