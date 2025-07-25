import { BlockHero_backend } from '../../declarations/BlockHero_backend';



export async function registerUser(identity, userId, userPw, userAuthority) {
  try {
      await BlockHero_backend.register_user(identity, userId, userPw, userAuthority);
      console.log("User registered successfully");
  } catch (error) {
      console.error("Error registering user:", error);
  }
}

export async function checkUserRegistered(identity) {
  try {
      const isRegistered = await BlockHero_backend.check_user_registered(identity);
      console.log("Is user registered?", isRegistered);
      return isRegistered;
  } catch (error) {
      console.error("Error checking user registration:", error);
      return false;
  }
}

export async function login(identity, userId, userPw) {
  try {
      const isAuthenticated = await BlockHero_backend.login(identity, userId, userPw);
      console.log("Login successful?", isAuthenticated);
      return isAuthenticated;
  } catch (error) {
      console.error("Error during login:", error);
      return false;
  }
}

export async function uploadFile(title, content, fileAuthority) {
  try {
      await BlockHero_backend.upload_file(title, content, fileAuthority);
      console.log("File uploaded successfully");
  } catch (error) {
      console.error("Error uploading file:", error);
  }
}

export async function readFile(title, identity) {
  try {
      const fileContent = await BlockHero_backend.read_file(title, identity);
      if (fileContent) {
          console.log("File content:", fileContent);
      } else {
          console.log("You do not have permission to read this file or it does not exist.");
      }
      return fileContent;
  } catch (error) {
      console.error("Error reading file:", error);
      return "";
  }
}

export async function readLogs(limit, order) {
  try {
      const logs = await BlockHero_backend.read_logs(limit, order);
      console.log("Logs:", logs);
      return logs;
  } catch (error) {
      console.error("Error reading logs:", error);
      return [];
  }
}
