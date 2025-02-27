// useUserPermissions.js
import { useEffect, useState } from "react";
import { supabase } from "../app/supabaseClient";

export function useUserPermissions() {
  const [userId, setUserId] = useState("");
  const [perm, setPerm] = useState("");
  const [read, setRead] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("sb-velfmvmemrzurdweumyo-auth-token");
    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        setUserId(parsedToken?.user?.id);
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getInfo(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (perm) {
      getPerm(perm);
    }
  }, [perm]);

  async function getInfo(userId: string) {
    try {
      const { data: agentData, error: agentError } = await supabase
        .from("Agents")
        .select("perm")
        .eq("user_id", userId)
        .single();

      if (agentError) {
        throw new Error(agentError.message);
      }

      if (agentData) {
        setPerm(agentData.perm);
      }

      return agentData;
    } catch (error) {
      console.error("Error fetching agent info:", error);
      throw error;
    }
  }

  async function getPerm(perm: string) {
    try {
      const { data: agentData, error: agentError } = await supabase
        .from("Permissions")
        .select("read")
        .eq("id", perm)
        .single();

      if (agentData) {
        setRead(agentData.read);
      }

      return agentData;
    } catch (error) {
      console.error("Error fetching agent info:", error);
      throw error;
    }
  }

  return { perm, read };
}