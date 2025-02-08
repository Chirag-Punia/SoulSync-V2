import React from "react";
import { Card, CardBody, Button, Avatar, Badge } from "@nextui-org/react";
import {
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  Star,
  Globe2,
  Clock,
  GraduationCap,
  Award,
} from "lucide-react";

const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    experience: "15 years",
    education: "Ph.D. in Clinical Psychology",
    image: "https://i.pravatar.cc/150?img=32",
    availability: "Mon, Wed, Fri",
    rating: 4.9,
    reviews: 127,
    price: "$120/session",
    languages: ["English", "Spanish"],
    contact: {
      email: "dr.sarah@example.com",
      phone: "+1 (555) 123-4567",
    },
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Trauma & PTSD",
    experience: "12 years",
    education: "Psy.D. in Psychology",
    image: "https://i.pravatar.cc/150?img=51",
    availability: "Tue, Thu, Sat",
    rating: 4.8,
    reviews: 98,
    price: "$130/session",
    languages: ["English", "Mandarin"],
    contact: {
      email: "dr.chen@example.com",
      phone: "+1 (555) 234-5678",
    },
  },
  {
    id: 3,
    name: "Dr. Emily Martinez",
    specialty: "Relationship Counseling",
    experience: "10 years",
    education: "Ph.D. in Marriage & Family Therapy",
    image: "https://i.pravatar.cc/150?img=23",
    availability: "Mon, Tue, Thu",
    rating: 4.7,
    reviews: 84,
    price: "$110/session",
    languages: ["English", "Portuguese"],
    contact: {
      email: "dr.martinez@example.com",
      phone: "+1 (555) 345-6789",
    },
  },
];

const TherapistCard = ({ therapist }) => {
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="border-none">
      <CardBody className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/40">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar
                  src={therapist.image}
                  className="w-40 h-40"
                  isBordered
                  color="secondary"
                />
                <Badge
                  content="Available"
                  color="success"
                  className="absolute -bottom-2 right-0"
                />
              </div>

              <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                {therapist.name}
              </h3>
              <p className="text-purple-600 dark:text-purple-300 font-medium mb-3">
                {therapist.specialty}
              </p>

              <div className="flex items-center gap-2 mb-4">
                {renderRatingStars(therapist.rating)}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  ({therapist.reviews})
                </span>
              </div>

              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {therapist.price}
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Experience
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {therapist.experience}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Education
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {therapist.education}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Languages
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {therapist.languages.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Availability
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {therapist.availability}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
              <Button
                color="secondary"
                startContent={<CalendarIcon className="w-4 h-4" />}
                className="w-full"
              >
                Book Session
              </Button>

              <Button
                variant="bordered"
                color="secondary"
                startContent={<PhoneIcon className="w-4 h-4" />}
                as="a"
                href={`tel:${therapist.contact.phone}`}
                className="w-full"
              >
                Call
              </Button>

              <Button
                variant="bordered"
                color="secondary"
                startContent={<MailIcon className="w-4 h-4" />}
                as="a"
                href={`mailto:${therapist.contact.email}`}
                className="w-full"
              >
                Email
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const Therapists = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Find Your Perfect Therapist
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Our experienced therapists are here to support your mental health
          journey. Book a session with a qualified professional today.
        </p>
      </div>

      <div className="space-y-8">
        {therapists.map((therapist) => (
          <TherapistCard key={therapist.id} therapist={therapist} />
        ))}
      </div>
    </div>
  );
};

export default Therapists;
