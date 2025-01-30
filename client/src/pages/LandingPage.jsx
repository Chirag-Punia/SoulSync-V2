import { Button, Card, Image, Chip } from "@nextui-org/react";
import { FaUsers, FaBookReader, FaStar, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRef, useCallback, useState, useEffect } from "react";
import { RiMentalHealthLine } from "react-icons/ri";
import { CiMedicalCase } from "react-icons/ci";
import { BsEmojiSmile, BsLightbulb } from "react-icons/bs";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function LandingPage() {
  const plansRef = useRef(null);
  const learnRef = useRef(null);
  const navigator = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState("2025-01-26 17:00:16");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = now.toISOString().slice(0, 19).replace("T", " ");
      setCurrentDateTime(formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesConfig = {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      color: { value: "#a855f7" },
      shape: { type: "circle" },
      opacity: {
        value: 0.5,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 4 },
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="absolute inset-0 -z-10"
      />

      <div className="absolute inset-0 bg-gradient-radial from-purple-200/30 via-pink-100/30 to-blue-100/30 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 -z-10" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 text-sm text-gray-500 dark:text-gray-400"
        >
          {currentDateTime} UTC
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col-reverse md:flex-row items-center justify-between py-12"
        >
          <motion.div
            variants={itemVariants}
            className="md:w-1/2 space-y-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 p-8 rounded-2xl border border-white/20 shadow-xl"
          >
            <Chip color="secondary" variant="shadow" className="text-sm">
              Welcome to SoulSync
            </Chip>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Your Journey to Mental Wellness Starts Here
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Get professional support, connect with others, and access
              resources to improve your mental well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                onPress={() =>
                  plansRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                className="backdrop-blur-lg bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-white transition-all duration-300"
                variant="ghost"
                onPress={() =>
                  learnRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:w-1/2 mb-8 md:mb-0 md:pl-8"
          >
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800"
              alt="Mental Health"
              className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-white/20"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 px-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-2xl shadow-xl border border-white/20 my-16"
        >
          {[
            {
              value: "10k+",
              label: "Active Users",
              icon: <FaUsers className="text-purple-500" />,
            },
            {
              value: "24/7",
              label: "Support",
              icon: <RiMentalHealthLine className="text-purple-500" />,
            },
            {
              value: "98%",
              label: "Satisfaction",
              icon: <FaStar className="text-purple-500" />,
            },
            {
              value: "50+",
              label: "Expert Resources",
              icon: <FaBookReader className="text-purple-500" />,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <h3 className="text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div ref={learnRef} className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 gradient-text"
          >
            How We Support Your Journey
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: (
                  <RiMentalHealthLine className="text-purple-500 text-4xl" />
                ),
                title: "AI-Powered Support",
                description:
                  "24/7 access to our AI chatbot for immediate emotional support and guidance. Never feel alone on your journey.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <FaUsers className="text-purple-500 text-4xl" />,
                title: "Supportive Community",
                description:
                  "Connect with others who understand your journey in our moderated community forums. Share experiences and grow together.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <FaBookReader className="text-purple-500 text-4xl" />,
                title: "Expert Resources",
                description:
                  "Access curated mental health resources, articles, and self-help tools. Learn at your own pace.",
                gradient: "from-teal-500 to-green-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                      <div className="mt-6 flex items-center justify-end">
                        <Button
                          className={`bg-gradient-to-r ${feature.gradient} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                          size="sm"
                          variant="shadow"
                        >
                          Learn More →
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {[
              { icon: <BsEmojiSmile />, text: "Mood Tracking" },
              { icon: <CiMedicalCase />, text: "Guided Meditation" },
              { icon: <BsLightbulb />, text: "Journal Prompts" },
              { icon: <FaUsers />, text: "Group Support" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-4 backdrop-blur-xl bg-white/5 dark:bg-black/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <span className="text-2xl text-purple-500">{item.icon}</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 flex flex-col md:flex-row items-center gap-8"
        >
          <motion.div variants={itemVariants} className="md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800"
              alt="Meditation"
              className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-white/20"
            />
            <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/10 dark:bg-black/10 p-2 rounded-lg">
              <p className="text-sm text-white">
                Last updated: {currentDateTime}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="md:w-1/2 space-y-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 p-8 rounded-2xl border border-white/20"
          >
            <h2 className="text-3xl font-bold gradient-text">
              Your Daily Dose of Wellness
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: <BsEmojiSmile className="text-purple-500 text-3xl" />,
                  title: "Mood Tracking",
                  description:
                    "Track your daily moods with personalized insights",
                },
                {
                  icon: <CiMedicalCase className="text-purple-500 text-3xl" />,
                  title: "Meditation Sessions",
                  description: "Guided meditation sessions for stress relief",
                },
                {
                  icon: <BsLightbulb className="text-purple-500 text-3xl" />,
                  title: "Daily Exercises",
                  description: "Interactive exercises and journaling prompts",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div ref={plansRef} className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Choose Your Wellness Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the plan that best fits your needs. All plans include our
              core features with additional perks as you level up.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Basic",
                price: "0",
                description: "Perfect for getting started",
                features: [
                  "Basic AI chat support",
                  "Community access",
                  "Limited resources",
                  "Email support",
                ],
                gradient: "from-gray-500 to-gray-600",
                chipColor: "default",
                popular: false,
              },
              {
                name: "Premium",
                price: "9.99",
                description: "Most popular choice",
                features: [
                  "Unlimited AI chat",
                  "Priority community access",
                  "Full resource library",
                  "Guided meditation sessions",
                  "24/7 chat support",
                ],
                gradient: "from-purple-500 to-pink-500",
                chipColor: "secondary",
                popular: true,
              },
              {
                name: "Professional",
                price: "19.99",
                description: "Complete wellness solution",
                features: [
                  "All Premium features",
                  "1-on-1 counseling sessions",
                  "Personalized wellness plan",
                  "Progress tracking dashboard",
                  "Priority support",
                ],
                gradient: "from-yellow-500 to-orange-500",
                chipColor: "warning",
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative ${
                  plan.popular ? "transform scale-105" : ""
                }`}
              >
                <Card
                  className={`p-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 border ${
                    plan.popular ? "border-purple-500" : "border-white/20"
                  } hover:border-purple-500/50 transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Chip
                        color="secondary"
                        variant="shadow"
                        className="animate-pulse"
                      >
                        Most Popular
                      </Chip>
                    </div>
                  )}

                  <div className="text-center mb-6 pt-4">
                    <Chip
                      color={plan.chipColor}
                      variant="flat"
                      className="mb-4"
                    >
                      {plan.name}
                    </Chip>
                    <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {plan.description}
                    </p>
                    <p className="text-4xl font-bold gradient-text">
                      ${plan.price}
                      <span className="text-sm text-gray-500">/month</span>
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <FaCheck className="text-green-500" />
                        <p className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300`}
                    size="lg"
                    onPress={() => navigator("/signup")}
                  >
                    {plan.price === "0" ? "Get Started" : "Start Free Trial"}
                  </Button>

                  {plan.popular && (
                    <p className="text-center text-sm text-purple-400 mt-4">
                      ✨ 14-day free trial included
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-300">
              30-day money-back guarantee • Cancel anytime • Secure payment
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16"
        >
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Voices of Our Community
          </h2>

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-16"
          >
            <Card className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"
                    alt="Featured User"
                    className="rounded-full w-32 h-32 object-cover border-4 border-purple-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                    <FaStar className="text-white text-xl" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                  </div>
                  <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-4">
                    "SoulSync has transformed my approach to mental wellness.
                    The AI support and community here are unlike anything I've
                    experienced before. It's like having a support system in
                    your pocket 24/7."
                  </p>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      David Chen
                    </h4>
                    <p className="text-purple-400">Premium Member • 1 year</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                name: "Sarah Mitchell",
                role: "Premium Member",
                time: "6 months",
                text: "The daily check-ins and guided meditation sessions have helped me maintain a positive mindset throughout my journey.",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                name: "James Rodriguez",
                role: "Professional Member",
                time: "3 months",
                text: "As a mental health professional, I'm impressed by the comprehensive resources and support system SoulSync provides.",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150",
                name: "Emily Wang",
                role: "Premium Member",
                time: "9 months",
                text: "The community here is incredibly supportive. I've made genuine connections that have helped me grow.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="p-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 hover:border-purple-500/50 transition-all duration-300">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-full w-20 h-20 object-cover mx-auto border-2 border-purple-500 group-hover:border-4 transition-all duration-300"
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="italic mb-4 text-center text-gray-700 dark:text-gray-300">
                    "{testimonial.text}"
                  </p>
                  <div className="text-center">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {testimonial.name}
                    </p>
                    <p className="text-purple-400 text-sm">
                      {testimonial.role} • {testimonial.time}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Trusted by individuals and organizations worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50"></div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative my-16"
        >
          <Card className="overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-gradient" />
            <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 p-12 text-center">
              <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 gradient-text">
                  Start Your Wellness Journey Today
                </h2>
                <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
                  Join thousands who have found peace and support through
                  SoulSync. Your journey to better mental health begins here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    onPress={() => navigator("/signup")}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    size="lg"
                    className="backdrop-blur-lg bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-white transition-all duration-300"
                    variant="ghost"
                    onPress={() =>
                      learnRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Learn More
                  </Button>
                </div>
                <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                  No credit card required • 14-day free trial • Cancel anytime
                </p>
              </motion.div>
            </div>
          </Card>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Questions? We're here to help 24/7
            </p>
            <Button variant="light" className="mt-2 text-purple-500">
              Contact Support →
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingPage;
