import React from "react";
import { Tabs, Tab, Card } from "@nextui-org/react";
import MindfulnessTab from "./tabs/MindfulnessTab";
import PhysicalTab from "./tabs/PhysicalTab";
import SocialTab from "./tabs/SocialTab";
import PersonalGrowthTab from "./tabs/PersonalGrowthTab";
import LifestyleTab from "./tabs/LifestyleTab";

function ChallengesTabs() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl px-4">
        <Tabs
          aria-label="Wellness Challenge Categories"
          color="secondary"
          variant="bordered"
          className="flex justify-center"
          classNames={{
            tabList: "flex-wrap justify-center sm:flex-nowrap gap-2",
            tab: "w-auto",
            panel: "w-full",
          }}
        >
          <Tab key="mindfulness" title="Mindfulness">
            <Card className="p-4 sm:p-6 w-full">
              <MindfulnessTab />
            </Card>
          </Tab>
          <Tab key="physical" title="Physical">
            <Card className="p-4 sm:p-6 w-full">
              <PhysicalTab />
            </Card>
          </Tab>
          <Tab key="social" title="Social">
            <Card className="p-4 sm:p-6 w-full">
              <SocialTab />
            </Card>
          </Tab>
          <Tab key="growth" title="Personal Growth">
            <Card className="p-4 sm:p-6 w-full">
              <PersonalGrowthTab />
            </Card>
          </Tab>
          <Tab key="lifestyle" title="Lifestyle">
            <Card className="p-4 sm:p-6 w-full">
              <LifestyleTab />
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ChallengesTabs;
