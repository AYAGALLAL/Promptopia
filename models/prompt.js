import { db, auth } from "../firebase.config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Function to create a prompt
export async function createPrompt(creator, prompt, tag) {
  if (!auth.currentUser) return null; // Ensure user is logged in

  const newPrompt = {
    creator,
    prompt,
    tag,
  };

  const docRef = await addDoc(collection(db, "prompts"), newPrompt);
  return docRef.id; // Return the new prompt ID
}

// Function to get all prompts
export async function getAllPrompts() {
  const querySnapshot = await getDocs(collection(db, "prompts"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Function to get prompts of the logged-in user
export async function getUserPrompts() {
  if (!auth.currentUser) return [];

  const q = query(collection(db, "prompts"), where("creator", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Function to update a prompt (Only if the user owns it)
export async function updatePrompt(promptId, newContent, newTags) {
  const promptRef = doc(db, "prompts", promptId);
  await updateDoc(promptRef, {
    content: newContent,
    tags: newTags,
  });
}

// Function to delete a prompt (Only if the user owns it)
export async function deletePrompt(promptId) {
  const promptRef = doc(db, "prompts", promptId);
  await deleteDoc(promptRef);
}
