"use client";
import { useSession } from "@/contexts/session";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { BASE_URL, DEFAULT_VALUES } from "@/utils";
import axios from "axios";

export const Signup = ({
  sessionId,
  userId,
}: {
  sessionId: string;
  userId?: string | null;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    MIN_PASS_LENGTH,
    MAX_PASS_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_USERNAME_LENGTH
   } = DEFAULT_VALUES;

  const { setUserId } = useSession();
  const router = useRouter();

  if (userId) {
    setUserId(userId);
    router.push(`/profile/${userId}`);
  }

  const handleSignup = useCallback(async () => {
    if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
      setError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`);
      return;
    }
    if (password.length < MIN_PASS_LENGTH || password.length > MAX_PASS_LENGTH) {
      setError(`Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { id } = await axios.post(`${BASE_URL}/api/auth/signup`, {
        username,
        password
      }).then((res) => res.data);

      if (id) {
        setUserId(id);
        router.push(`/profile/${id}`);
      } else {
        setError("Signup failed. Please try again.");
      }

    } catch (e) {
      console.error("Signup error:", e);
      setError("An error occurred during signup. Please try again.");
    }

  }, [username, password, confirmPassword, sessionId, MAX_PASS_LENGTH, MIN_PASS_LENGTH, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH]);


  return (
    <form className="flex flex-col w-full h-full mx-auto mt-20 gap-5 items-center justify-center max-w-sm p-5 rounded-md shadow-md">
      {error && <h4 className="text-red-500">{error}</h4>}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-2 text-center mb-2 w-full">
        <label htmlFor="username">Username</label>
        <input
          required
          type="text"
          id="username"
          value={username}
          onChange={(e) => {
            e.preventDefault();
            setUsername(e.target.value);
          }}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-between gap-2 text-center mb-2 w-full">
        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            e.preventDefault();
            setPassword(e.target.value);
          }}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <div className="flex flex-col xl:flex-row items-center justify-between gap-2 text-center mb-2 w-full">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          required
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            e.preventDefault();
            setConfirmPassword(e.target.value);
          }}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={handleSignup}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}
