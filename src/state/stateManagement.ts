import { reactive, watch } from 'vue';

const LOCAL_STORAGE_KEY = 'app_store';

export interface TemplatePost {
  id: string;
  title: string;
}

interface BookMarkList {
  id: string;
  title: string;
  bookMarkedPosts: TemplatePost[];
}

export interface User {
  id: string;
  userName: string;
  email: string;
  myBookMarkLists: BookMarkList[];
  myPosts: TemplatePost[]
}

// Function to load data from local storage
function loadFromLocalStorage(): { currentUser: User } {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing local storage data:', error);
    }
  }
  return {
    currentUser: {
      id: '',
      userName: '',
      email: '',
      myBookMarkLists: [],
      myPosts:[]
    },
  };
}

// Reactive store initialized from local storage
export const store = reactive(loadFromLocalStorage());

// Watch for changes in the store and sync them to local storage
watch(
  () => store,
  (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
  },
  { deep: true } // Ensure nested objects are also watched
);

// Function to update the current user from a GraphQL response
export function updateUser(userData: User) {
  store.currentUser.id = userData.id;
  store.currentUser.userName = userData.userName;
  store.currentUser.email = userData.email;
  store.currentUser.myBookMarkLists = userData.myBookMarkLists.map((list) => ({
    id: list.id,
    title: list.title,
    bookMarkedPosts: list.bookMarkedPosts.map((post) => ({
      id: post.id,
      title: post.title,
    })),
  }));
  store.currentUser.myPosts = userData.myPosts.map((post) =>({
    id:post.id,
    title:post.title,
  }));
}
// Function to get all bookmarked posts from all bookMarkLists
export function getAllBookMarkedPosts() {
  return store.currentUser.myBookMarkLists.flatMap((list) => list.bookMarkedPosts);
}
export function getAllMyPosts(){
  return store.currentUser.myPosts;
}

export function emptyUser(){
  store.currentUser.id = '';
  store.currentUser.userName = '';
  store.currentUser.email = '';
  store.currentUser.myBookMarkLists =[];
  store.currentUser.myPosts =[];
}
