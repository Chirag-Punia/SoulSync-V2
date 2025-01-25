import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebaseConfig";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    navigate("/login");
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await userService.signUpUser(user);
      toast.success(
        "Welcome to Mental Health Support! Your journey begins here."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error);
      const errorMessage =
        error.message || "Unable to create account. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await userService.signUpUser(user);
      toast.success(
        "Welcome to Mental Health Support! Your journey begins here."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error("Unable to sign up with Google. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[600px]">
      <Card className="w-full max-w-md mx-4" shadow="sm">
        <CardHeader className="flex flex-col items-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            Begin Your Journey
          </h1>
          <p className="text-small text-default-500 text-center mt-1">
            Join our supportive community today
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="px-8 py-6">
          <div className="flex flex-col gap-6">
            <Input
              label="Email"
              type="email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              size="lg"
            />

            <Input
              label="Password"
              type="password"
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              size="lg"
            />

            <Input
              label="Confirm Password"
              type="password"
              variant="bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              size="lg"
            />

            <Button
              color="secondary"
              variant="shadow"
              onPress={handleSignup}
              className="w-full font-semibold"
              size="lg"
            >
              Create Account
            </Button>

            <div className="flex items-center gap-4">
              <Divider className="flex-1" />
              <span className="text-default-500 text-small">or</span>
              <Divider className="flex-1" />
            </div>

            <Button
              variant="bordered"
              onPress={handleGoogleSignup}
              className="w-full"
              size="lg"
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>

            <div className="flex justify-center mt-2">
              <Button
                variant="light"
                onPress={handleRedirectToLogin}
                className="text-primary"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Signup;
