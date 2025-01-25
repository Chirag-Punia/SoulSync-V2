import { Button, Card, Image, Chip } from "@nextui-org/react";
import { FaUsers, FaBookReader, FaStar, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { RiMentalHealthLine } from "react-icons/ri";
import { CiMedicalCase } from "react-icons/ci";
import { BsEmojiSmile, BsLightbulb } from "react-icons/bs";

function LandingPage() {
  const plansRef = useRef(null);
  const learnRef = useRef(null);
  const navigator = useNavigate();
  const scrollToPlans = () => {
    plansRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToLearnMore = () => {
    learnRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-200 via-pink-100 to-blue-100 dark:from-purple-900 dark:via-pink-900 dark:to-blue-900 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between py-8 sm:py-12">
          <div className="md:w-1/2 space-y-3 backdrop-blur-lg bg-white/10 dark:bg-black/10 p-4 sm:p-6 rounded-2xl shadow-xl">
            <Chip color="secondary" variant="shadow" className="mb-2">
              Welcome to SoulSync
            </Chip>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3">
              Your Journey to Mental Wellness Starts Here
            </h1>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
              Get professional support, connect with others, and access
              resources to improve your mental well-being. Let's make every day
              a step towards a happier you! 🌟
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                color="secondary"
                size="lg"
                fullWidth
                className="sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                onPress={scrollToPlans}
              >
                Start Free Trial
              </Button>
              <Button
                color="primary"
                variant="ghost"
                size="lg"
                fullWidth
                className="sm:w-auto backdrop-blur-lg bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
                onPress={scrollToLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mb-4 md:mb-0">
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800"
              alt="Mental Health"
              className="w-full rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-white/20 backdrop-blur-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12 px-4 backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-2xl mb-16 shadow-xl border border-white/20">
          <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              10k+
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Active Users</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              24/7
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Support</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              98%
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Satisfaction</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              50+
            </h3>
            <p className="text-gray-700 dark:text-gray-300">Expert Resources</p>
          </div>
        </div>

        <div className="py-16" ref={learnRef}>
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            How We Support Your Journey
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="text-4xl text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text mb-4">
                <RiMentalHealthLine className="text-purple-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                AI-Powered Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                24/7 access to our AI chatbot for immediate emotional support
                and guidance. Never feel alone on your journey.
              </p>
            </Card>

            <Card className="p-6 hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="text-4xl text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text mb-4">
                <FaUsers className="text-purple-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Supportive Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with others who understand your journey in our moderated
                community forums. Share experiences and grow together.
              </p>
            </Card>

            <Card className="p-6 hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="text-4xl text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text mb-4">
                <FaBookReader className="text-purple-500 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Expert Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access curated mental health resources, articles, and self-help
                tools. Learn at your own pace.
              </p>
            </Card>
          </div>
        </div>

        <div className="py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800"
              alt="Meditation"
              className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-white/20"
            />
          </div>
          <div className="md:w-1/2 space-y-6 backdrop-blur-xl bg-white/10 dark:bg-black/10 p-8 rounded-2xl border border-white/20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Daily Dose of Wellness
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <BsEmojiSmile className="text-purple-500 text-4xl" />
                <p className="text-gray-700 dark:text-gray-300">
                  Daily mood tracking with personalized insights
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <CiMedicalCase className="text-purple-500 text-4xl" />
                <p className="text-gray-700 dark:text-gray-300">
                  Guided meditation sessions for stress relief
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                <BsLightbulb className="text-purple-500 text-4xl" />
                <p className="text-gray-700 dark:text-gray-300">
                  Interactive exercises and journaling prompts
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={plansRef} className="py-16">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Choose Your Wellness Journey
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Select the plan that best fits your needs. All plans include our
            core features with additional perks as you level up.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 relative hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 mt-6">
                <Chip color="default" variant="shadow">
                  Basic
                </Chip>
              </div>
              <div className="text-center mb-6 pt-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Free
                </h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  $0<span className="text-sm text-gray-500">/month</span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Basic AI chat support
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Community access
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Limited resources
                  </p>
                </div>
              </div>
              <Button
                color="secondary"
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onPress={() => {
                  navigator("/signup");
                }}
              >
                Get Started
              </Button>
            </Card>

            <Card className="p-6 relative hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border-2 border-purple-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 mt-6">
                <Chip color="secondary" variant="shadow">
                  Most Popular
                </Chip>
              </div>
              <div className="text-center mb-6 pt-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Premium
                </h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  $9.99<span className="text-sm text-gray-500">/month</span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Unlimited AI chat support
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Priority community access
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Full resource library
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Guided meditation sessions
                  </p>
                </div>
              </div>
              <Button
                color="secondary"
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50"
                onPress={() => {
                  navigator("/signup");
                }}
              >
                Start Free Trial
              </Button>
            </Card>

            <Card className="p-6 relative hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 mt-6">
                <Chip color="warning" variant="shadow">
                  Professional
                </Chip>
              </div>
              <div className="text-center mb-6 pt-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Professional
                </h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  $19.99<span className="text-sm text-gray-500">/month</span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    All Premium features
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    1-on-1 counseling sessions
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Personalized wellness plan
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <FaCheck className="text-green-500" />
                  <p className="text-gray-700 dark:text-gray-300">
                    Progress tracking dashboard
                  </p>
                </div>
              </div>
              <Button
                color="warning"
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                onPress={() => {
                  navigator("/signup");
                }}
              >
                Get Professional
              </Button>
            </Card>
          </div>
        </div>

        <div className="py-16">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
                  alt="User"
                  className="rounded-full w-20 h-20 object-cover border-2 border-purple-500"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="italic mb-4 text-center text-gray-700 dark:text-gray-300">
                "This platform has been a game-changer for my mental health
                journey. The support and resources are invaluable."
              </p>
              <p className="font-semibold text-center text-gray-800 dark:text-gray-200">
                Sarah M.
              </p>
              <p className="text-sm text-gray-500 text-center">
                Premium Member
              </p>
            </Card>

            <Card className="p-6 hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
                  alt="User"
                  className="rounded-full w-20 h-20 object-cover border-2 border-purple-500"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="italic mb-4 text-center text-gray-700 dark:text-gray-300">
                "The community here is so supportive and understanding. I
                finally feel like I'm not alone."
              </p>
              <p className="font-semibold text-center text-gray-800 dark:text-gray-200">
                James R.
              </p>
              <p className="text-sm text-gray-500 text-center">
                Professional Member
              </p>
            </Card>

            <Card className="p-6 hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150"
                  alt="User"
                  className="rounded-full w-20 h-20 object-cover border-2 border-purple-500"
                />
              </div>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="italic mb-4 text-center text-gray-700 dark:text-gray-300">
                "The AI chat support is amazing. It's like having a supportive
                friend available 24/7."
              </p>
              <p className="font-semibold text-center text-gray-800 dark:text-gray-200">
                Emily W.
              </p>
              <p className="text-sm text-gray-500 text-center">
                Premium Member
              </p>
            </Card>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-12 text-center my-16 border border-white/20 shadow-xl">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Join thousands of others who have found support and guidance on
            their mental health journey. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              color="secondary"
              size="lg"
              onPress={() => {
                navigator("/signup");
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Start Free Trial
            </Button>
            <Button
              color="primary"
              variant="ghost"
              size="lg"
              href="/resources"
              className="backdrop-blur-lg bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300"
            >
              View Success Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
