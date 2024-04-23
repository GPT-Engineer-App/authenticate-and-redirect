// Complete the Index page component here
// Use chakra-ui and react-icons for UI components
import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, useToast, Heading, Text, Container } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toast = useToast();

  const supabaseUrl = "https://mnwefvnykbgyhbdzpleh.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

  useEffect(() => {
    const session = localStorage.getItem("supabase.auth.token");
    if (session) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("supabase.auth.token", data.access_token);
        setIsLoggedIn(true);
        toast({
          title: "Logged in successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error_description || "Failed to login");
      }
    } catch (error) {
      toast({
        title: "Failed to login",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("supabase.auth.token");
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container centerContent>
      <VStack spacing={4} mt="20">
        {isLoggedIn ? (
          <Box textAlign="center">
            <Heading mb={4}>Welcome!</Heading>
            <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading mb={6}>Login</Heading>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} mb={3} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} mb={6} />
            <Button leftIcon={<FaSignInAlt />} colorScheme="teal" onClick={handleLogin}>
              Login
            </Button>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
