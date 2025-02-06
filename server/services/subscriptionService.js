import { SNS } from "@aws-sdk/client-sns";
import { Lambda } from "@aws-sdk/client-lambda";
import User from "../models/User.js";

const sns = new SNS({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const subscriptionService = {
  async handleSubscriptionConfirmation(message) {
    try {
      const subscriptionArn = message.SubscriptionArn;
      const email = message.Endpoint;

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            isSubscribedToAffirmations: true,
            snsSubscriptionArn: subscriptionArn,
            subscriptionConfirmed: true,
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Subscription confirmation error:", error);
      throw error;
    }
  },

  async subscribeToAffirmations(email) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isSubscribedToAffirmations) {
        throw new Error("User is already subscribed to affirmations");
      }

      const topicArn = process.env.AWS_SNS_TOPIC_ARN;
      const params = {
        Protocol: "email",
        TopicArn: topicArn,
        Endpoint: email,
      };

      const snsResponse = await sns.subscribe(params);

      const userData = {
        email,
        isSubscribedToAffirmations: true,
        snsSubscriptionArn: snsResponse.SubscriptionArn,
        subscriptionConfirmed: false,
      };

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: userData },
        { upsert: true, new: true }
      );

      const lambda = new Lambda({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
      await lambda.invoke({
        FunctionName: process.env.AWS_LAMBDA_WELCOME_FUNCTION,
        InvocationType: "Event",
        Payload: JSON.stringify({
          email,
          name: existingUser ? existingUser.displayName : null,
        }),
      });

      return { existingUser: updatedUser };
    } catch (error) {
      console.error("Subscription service error:", error);
      throw error;
    }
  },

  async unsubscribeFromAffirmations(email) {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.isSubscribedToAffirmations) {
        throw new Error("User is not subscribed to affirmations");
      }

      if (user.snsSubscriptionArn) {
        const params = {
          SubscriptionArn: user.snsSubscriptionArn,
        };
        await sns.unsubscribe(params);
      }

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            isSubscribedToAffirmations: false,
            snsSubscriptionArn: null,
          },
        }
      );

      return true;
    } catch (error) {
      console.error("Unsubscribe service error:", error);

      throw error;
    }
  },
};

export default subscriptionService;
