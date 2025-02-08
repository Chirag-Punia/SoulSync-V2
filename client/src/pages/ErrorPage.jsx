import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { HomeIcon, ArrowLeftIcon, HelpCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, -1, 1, -1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-64 h-64 mx-auto mb-8"
        >
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full fill-current text-purple-600 dark:text-purple-400"
          >
            <path d="M250 0C111.93 0 0 111.93 0 250s111.93 250 250 250 250-111.93 250-250S388.07 0 250 0zm0 50c110.46 0 200 89.54 200 200s-89.54 200-200 200S50 360.46 50 250 139.54 50 250 50zm-80.95 100c-22.09 0-40 17.91-40 40s17.91 40 40 40 40-17.91 40-40-17.91-40-40-40zm161.9 0c-22.09 0-40 17.91-40 40s17.91 40 40 40 40-17.91 40-40-17.91-40-40-40zM250 280c-60.85 0-110.71 45.37-118.64 104.14-1.38 10.28 5.86 19.86 16.14 21.24 10.28 1.38 19.86-5.86 21.24-16.14C174.73 348.96 208.75 320 250 320s75.27 28.96 81.26 69.24c1.38 10.28 10.96 17.52 21.24 16.14 10.28-1.38 17.52-10.96 16.14-21.24C360.71 325.37 310.85 280 250 280z" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Oops! 404
          </h1>
          <p className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Looks like you're lost in the mind space
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to
            another dimension. Don't worry, we're here to help you find your way
            back.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-x-4"
        >
          <Button
            color="secondary"
            variant="shadow"
            startContent={<HomeIcon />}
            onPress={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Go Home
          </Button>
          <Button
            variant="bordered"
            startContent={<ArrowLeftIcon />}
            onPress={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="light"
            startContent={<HelpCircleIcon />}
            onPress={() => navigate("/resources")}
          >
            Get Help
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg max-w-md mx-auto"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Need assistance? Our AI companion is here to help you navigate
            through our mental wellness platform.
          </p>
          <Button
            color="secondary"
            variant="flat"
            className="mt-2"
            onPress={() => navigate("/chat")}
          >
            Chat with AI Assistant
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
