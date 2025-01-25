import { auth } from "./firebaseConfig";

export const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");
  return await user.getIdToken();
};
