import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { Phone, Globe, Search, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const helplineData = [
  {
    id: 1,
    name: "National Suicide Prevention Lifeline",
    phone: "1-800-273-TALK (8255)",
    website: "https://suicidepreventionlifeline.org",
    category: "Crisis",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Free and confidential support for people in distress",
  },
  {
    id: 2,
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    website: "https://www.crisistextline.org",
    category: "Crisis",
    available: "24/7",
    languages: ["English"],
    description: "Free crisis counseling via text message",
  },
  {
    id: 3,
    name: "Disaster Distress Helpline",
    phone: "1-800-985-5990",
    website: "https://www.samhsa.gov/find-help/disaster-distress-helpline",
    category: "Crisis",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Crisis counseling for natural or human-caused disasters",
  },

  {
    id: 4,
    name: "Trevor Project",
    phone: "1-866-488-7386",
    website: "https://www.thetrevorproject.org",
    category: "LGBTQ+",
    available: "24/7",
    languages: ["English"],
    description: "Crisis intervention and suicide prevention for LGBTQ+ youth",
  },
  {
    id: 5,
    name: "LGBT National Hotline",
    phone: "1-888-843-4564",
    website: "https://www.glbthotline.org",
    category: "LGBTQ+",
    available: "M-F 4pm-12am ET",
    languages: ["English"],
    description: "Support, information and resources for the LGBTQ+ community",
  },

  {
    id: 6,
    name: "Veterans Crisis Line",
    phone: "1-800-273-8255 (Press 1)",
    website: "https://www.veteranscrisisline.net",
    category: "Veterans",
    available: "24/7",
    languages: ["English"],
    description: "Crisis support for veterans and their loved ones",
  },
  {
    id: 7,
    name: "Military OneSource",
    phone: "1-800-342-9647",
    website: "https://www.militaryonesource.mil",
    category: "Veterans",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support for military personnel and their families",
  },

  {
    id: 8,
    name: "Childhelp National Child Abuse Hotline",
    phone: "1-800-422-4453",
    website: "https://www.childhelp.org",
    category: "Child Support",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Prevention and treatment of child abuse",
  },
  {
    id: 9,
    name: "National Runaway Safeline",
    phone: "1-800-RUNAWAY",
    website: "https://www.1800runaway.org",
    category: "Child Support",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support for runaway and homeless youth",
  },

  {
    id: 10,
    name: "National Eating Disorders Association",
    phone: "1-800-931-2237",
    website: "https://www.nationaleatingdisorders.org",
    category: "Eating Disorders",
    available: "M-F 11am-9pm ET",
    languages: ["English", "Spanish"],
    description: "Support and resources for eating disorders",
  },
  {
    id: 11,
    name: "Overeaters Anonymous",
    phone: "1-505-891-2664",
    website: "https://oa.org",
    category: "Eating Disorders",
    available: "Various Hours",
    languages: ["English"],
    description: "Recovery from compulsive eating and food behaviors",
  },

  {
    id: 12,
    name: "National Alliance on Mental Illness (NAMI)",
    phone: "1-800-950-NAMI (6264)",
    website: "https://www.nami.org",
    category: "Mental Health",
    available: "M-F 10am-10pm ET",
    languages: ["English", "Spanish"],
    description: "Information, referrals and support for mental health",
  },
  {
    id: 13,
    name: "Postpartum Support International",
    phone: "1-800-944-4773",
    website: "https://www.postpartum.net",
    category: "Mental Health",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support for postpartum depression and anxiety",
  },

  {
    id: 14,
    name: "SAMHSA National Helpline",
    phone: "1-800-662-HELP (4357)",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    category: "Substance Abuse",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Treatment referral and information service",
  },
  {
    id: 15,
    name: "Alcoholics Anonymous",
    phone: "1-212-870-3400",
    website: "https://www.aa.org",
    category: "Substance Abuse",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support and resources for alcohol addiction recovery",
  },
  {
    id: 16,
    name: "Narcotics Anonymous",
    phone: "1-818-773-9999",
    website: "https://www.na.org",
    category: "Substance Abuse",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support and resources for drug addiction recovery",
  },

  {
    id: 17,
    name: "National Domestic Violence Hotline",
    phone: "1-800-799-SAFE (7233)",
    website: "https://www.thehotline.org",
    category: "Domestic Violence",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support for domestic violence survivors",
  },
  {
    id: 18,
    name: "RAINN National Sexual Assault Hotline",
    phone: "1-800-656-HOPE (4673)",
    website: "https://www.rainn.org",
    category: "Domestic Violence",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support for sexual assault survivors",
  },
  {
    id: 19,
    name: "National Teen Dating Abuse Helpline",
    phone: "1-866-331-9474",
    website: "https://www.loveisrespect.org",
    category: "Domestic Violence",
    available: "24/7",
    languages: ["English", "Spanish"],
    description: "Support for teen dating abuse and violence",
  },

  {
    id: 20,
    name: "Depression and Bipolar Support Alliance",
    phone: "1-800-826-3632",
    website: "https://www.dbsalliance.org",
    category: "Mental Health",
    available: "M-F 9am-5pm CT",
    languages: ["English"],
    description: "Support for people with mood disorders",
  },
  {
    id: 21,
    name: "National OCD Foundation",
    phone: "1-617-973-5801",
    website: "https://iocdf.org",
    category: "Mental Health",
    available: "M-F 9am-5pm ET",
    languages: ["English"],
    description: "Information and resources for OCD",
  },
];

const categories = [
  "All",
  "Crisis",
  "LGBTQ+",
  "Veterans",
  "Child Support",
  "Eating Disorders",
  "Mental Health",
  "Substance Abuse",
  "Domestic Violence",
];

function Helplines() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredHelplines = helplineData.filter((helpline) => {
    const matchesSearch =
      helpline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      helpline.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || helpline.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Mental Health Helplines
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Free, confidential support available 24/7. Reach out - you're not
          alone.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search helplines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="text-gray-400" />}
          className="w-full md:w-96"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              color={selectedCategory === category ? "secondary" : "default"}
              variant={selectedCategory === category ? "shadow" : "light"}
              onPress={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHelplines.map((helpline) => (
          <motion.div
            key={helpline.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/50 hover:shadow-lg transition-all">
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{helpline.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {helpline.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-xs">
                      {helpline.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      <a
                        href={`tel:${helpline.phone.replace(/\D/g, "")}`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {helpline.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <a
                        href={helpline.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {helpline.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-white/50 dark:bg-white/10 rounded-full text-xs"
                      >
                        {lang}
                      </span>
                    ))}
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 rounded-full text-xs flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {helpline.available}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredHelplines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No helplines found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default Helplines;
