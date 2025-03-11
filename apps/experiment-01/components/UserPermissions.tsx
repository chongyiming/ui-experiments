"use client";
import { useEffect, useState } from "react";
import { supabase } from "../app/supabaseClient";
import { get } from "http";

export function useUserPermissions() {
  const [userId, setUserId] = useState("");
  const [id, setId] = useState("");
  const [perms, setPermissions] = useState({
    dashboard: false,
    contacts: false,
  });
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Extract user ID from local storage auth token
  useEffect(() => {
    const authToken = localStorage.getItem(
      "sb-velfmvmemrzurdweumyo-auth-token"
    );
    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        setUserId(parsedToken?.user?.id);
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    }
  }, []);

  // Fetch agent info and permissions once we have the user ID
  useEffect(() => {
    if (userId) {
      const fetchAgentInfo = async () => {
        setIsLoading(true);
        try {
          // Get agent details in a single query
          const { data: agentData, error: agentError } = await supabase
            .from("Agents")
            .select("id, perm, username")
            .eq("user_id", userId)
            .single();

          if (agentError) {
            throw new Error(agentError.message);
          }

          if (agentData) {
            setId(agentData.id);
            setPermissions(agentData.perm);
            setName(agentData.username);

            // Fetch permissions immediately
            if (agentData.perm) {
              const { data: permData, error: permError } = await supabase
                .from("Permissions")
                .select("*")
                .eq("id", agentData.perm)
                .single();

              if (permError) {
                throw new Error(permError.message);
              }

              if (permData) {
                setPermissions(permData);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching agent info:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAgentInfo();
    }
  }, [userId]);

  return {
    userId,
    id,
    name,
    perms,
    isLoading,
  };
}
