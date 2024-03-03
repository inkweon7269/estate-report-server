import { join } from 'path';

// 서버 프로젝트의 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd();
// 외부에서 접근 가능한 파일들을 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';
// 프로필 이미지들을 저장할 폴더 이름
export const USERS_FOLDER_NAME = 'users';
export const REPORTS_FOLDER_NAME = 'reports';

// 실제 공개 폴더의 절대 경로
// /{프로젝트의 위치}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 프로필 이미지를 저장할 폴더
// /{프로젝트의 위치}/public/users
export const USERS_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, USERS_FOLDER_NAME);
export const REPORTS_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, REPORTS_FOLDER_NAME);

// 임시 폴더 이름
export const TEMP_FOLDER_NAME = 'temp';

// 상대 경로
// /public/users/aaa.png
export const USERS_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, USERS_FOLDER_NAME);
export const REPORTS_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, REPORTS_FOLDER_NAME);

// 임시 파일들을 저장할 폴더
// {프로젝트 경로}/temp
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME);
