import { Card, CardBody, Button } from "@nextui-org/react";
import { useState } from "react";

const resourceCategories = [
  {
    id: 1,
    title: "Mental Health Articles",
    resources: [
      { id: 1, title: "Understanding Anxiety", type: "article", link: "#" },
      {
        id: 2,
        title: "Depression: Signs and Symptoms",
        type: "article",
        link: "#",
      },
      {
        id: 3,
        title: "Stress Management Techniques",
        type: "article",
        link: "#",
      },
    ],
  },
  {
    id: 2,
    title: "Meditation Guides",
    resources: [
      { id: 4, title: "5-Minute Breathing Exercise", type: "video", link: "#" },
      { id: 5, title: "Guided Sleep Meditation", type: "audio", link: "#" },
      { id: 6, title: "Mindfulness Basics", type: "article", link: "#" },
    ],
  },
  {
    id: 3,
    title: "Crisis Support",
    resources: [
      {
        id: 7,
        title: "24/7 Crisis Hotline",
        type: "contact",
        link: "tel:1234567890",
      },
      { id: 8, title: "Find a Therapist", type: "tool", link: "#" },
      { id: 9, title: "Emergency Resources", type: "article", link: "#" },
    ],
  },
];

function Resources() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Resources
        </h1>
        {selectedCategory && (
          <Button
            color="primary"
            variant="light"
            onPress={() => setSelectedCategory(null)}
          >
            Back to Categories
          </Button>
        )}
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resourceCategories.map((category) => (
            <Card
              key={category.id}
              isPressable
              onPress={() => setSelectedCategory(category)}
              className="hover:scale-105 transition-transform"
            >
              <CardBody className="p-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {category.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {category.resources.length} resources available
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedCategory.title}
          </h2>
          {selectedCategory.resources.map((resource) => (
            <Card key={resource.id}>
              <CardBody className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                      Type: {resource.type}
                    </p>
                  </div>
                  <Button
                    color="primary"
                    as="a"
                    href={resource.link}
                    target="_blank"
                  >
                    Access Resource
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 bg-primary-50">
        <CardBody>
          <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
          <p className="mb-4">
            If you're in crisis or having thoughts of suicide, please reach out:
          </p>
          <Button color="danger" size="lg" as="a" href="tel:988">
            Call 988 - Crisis Lifeline
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Resources;
